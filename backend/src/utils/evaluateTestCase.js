'use strict';

const { generateHarness } = require('../harness/cppHarnessGenerator');
const { executeOnJudge } = require('../judgeClient');
const { parseOutputValue } = require('../harness/valueParser');
const { valuesMatch } = require('../harness/compare');

// Judge `status` -> our verdict vocabulary. Anything not "success" maps
// straight across; "success" still needs an output comparison.
const STATUS_VERDICTS = {
  compile_error: 'Compile Error',
  compile_timeout: 'Compile Error',
  compile_memory_exceeded: 'Compile Error',
  runtime_error: 'Runtime Error',
  time_limit_exceeded: 'Time Limit Exceeded',
  memory_limit_exceeded: 'Memory Limit Exceeded',
  internal_error: 'Internal Error',
};

/**
 * Runs one testcase end-to-end: generate the C++ harness, send it to the
 * judge, and (if it ran successfully) compare its output against
 * `expectedOutput`. Pass `expectedOutput: null` for a "just run it, don't
 * grade it" custom-input execution.
 *
 * Never throws for judged outcomes (compile errors, wrong answers, TLE,
 * ...) — those all come back as a normal result object with `verdict` set.
 * It only throws for infrastructure problems (bad testcase data, judge
 * unreachable), which the route layer turns into a 500/503.
 */
async function evaluateTestCase({ spec, testCaseInput, expectedOutput = null, userCode, sortDepth = 0 }) {
  const sourceCode = generateHarness({ spec, testCaseInput, userCode });
  const judgeResult = await executeOnJudge({ sourceCode, stdin: '' });

  const base = {
    input: testCaseInput,
    expectedOutput,
    compile: judgeResult.compile || null,
    run: judgeResult.run || null,
    timing: judgeResult.timing || null,
    rawStdout: judgeResult.run ? judgeResult.run.stdout : null,
  };

  if (judgeResult.status !== 'success') {
    return {
      ...base,
      verdict: STATUS_VERDICTS[judgeResult.status] || 'Internal Error',
      message: judgeResult.message,
      actualOutput: null,
      passed: false,
    };
  }

  const actualRaw = (judgeResult.run.stdout || '').trim();

  // No ground truth to grade against (a free-form "custom input" run) —
  // just hand back whatever the program printed.
  if (expectedOutput === null) {
    return {
      ...base,
      verdict: 'Executed',
      message: 'Program executed successfully.',
      actualOutput: actualRaw,
      passed: null,
    };
  }

  let expectedVal;
  let actualVal;
  let comparisonError = null;
  try {
    expectedVal = parseOutputValue(expectedOutput);
  } catch (err) {
    throw new Error(`Problem data error: expected output is not valid: ${expectedOutput}`);
  }
  try {
    actualVal = parseOutputValue(actualRaw);
  } catch (err) {
    comparisonError = `Program output could not be parsed as a result value: ${actualRaw.slice(0, 500)}`;
  }

  const passed = comparisonError ? false : valuesMatch(expectedVal, actualVal, sortDepth);

  return {
    ...base,
    verdict: passed ? 'Accepted' : 'Wrong Answer',
    message: comparisonError || (passed ? 'Output matches expected result.' : 'Output does not match expected result.'),
    actualOutput: actualRaw,
    passed,
  };
}

module.exports = { evaluateTestCase, STATUS_VERDICTS };
