'use strict';

const express = require('express');
const { getProblem } = require('../problems');
const { evaluateTestCase } = require('../utils/evaluateTestCase');
const { JudgeUnavailableError, JudgeBusyError } = require('../judgeClient');
const config = require('../config');

const router = express.Router();

const COMPILE_FAIL_VERDICTS = new Set(['Compile Error', 'Internal Error']);

/** Runs `items` through `worker` with at most `limit` in flight at once. */
async function runWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;

  async function lane() {
    while (next < items.length) {
      const i = next++;
      results[i] = await worker(items[i], i);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, lane));
  return results;
}

router.post('/:id/submit', async (req, res, next) => {
  try {
    const { language, code } = req.body || {};

    if (typeof code !== 'string' || code.trim().length === 0) {
      return res.status(400).json({ error: '"code" is required and must be a non-empty string.' });
    }
    if (Buffer.byteLength(code, 'utf8') > config.maxSourceBytes) {
      return res.status(400).json({ error: `"code" exceeds the ${config.maxSourceBytes}-byte limit.` });
    }
    if (language && language !== 'cpp') {
      return res.status(501).json({
        error: `Language "${language}" is not supported yet. Only "cpp" is wired up to the ` +
          `currently configured judge.`,
      });
    }

    const problem = getProblem(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: `No problem with id ${req.params.id}.` });
    }

    const testCases = problem.defaultTestCases;
    if (testCases.length === 0) {
      return res.status(500).json({ error: `Problem ${problem.id} has no testcases configured.` });
    }

    const runOne = (tc, idx) =>
      evaluateTestCase({
        spec: problem.spec,
        testCaseInput: tc.input,
        expectedOutput: tc.expected,
        userCode: code,
        sortDepth: problem.spec.sortDepth || 0,
      }).then((result) => ({ caseNum: idx + 1, input: tc.input, ...result }));

    // Run testcase #1 alone first: a compile failure is a property of the
    // submitted code, not the testcase, so it will reproduce identically on
    // every case. No need to pay for N judge round-trips just to learn that
    // N times.
    const firstResult = await runOne(testCases[0], 0);

    let perCase;
    if (COMPILE_FAIL_VERDICTS.has(firstResult.verdict) || testCases.length === 1) {
      perCase = [firstResult];
    } else {
      const rest = await runWithConcurrency(testCases.slice(1), config.submitConcurrency, (tc, i) =>
        runOne(tc, i + 1)
      );
      perCase = [firstResult, ...rest];
    }

    const totalCases = testCases.length;
    const totalPassed = perCase.filter((r) => r.passed === true).length;
    const allRan = perCase.length === totalCases;
    const allPassed = allRan && totalPassed === totalCases;

    let overallVerdict;
    if (allPassed) {
      overallVerdict = 'Accepted';
    } else {
      // Surface the most informative single verdict: the first non-passing
      // case's verdict (compile error takes priority since it short-circuits
      // everything else).
      const firstFailing = perCase.find((r) => r.passed !== true);
      overallVerdict = firstFailing ? firstFailing.verdict : 'Wrong Answer';
    }

    const runtimes = perCase.map((r) => (r.run ? r.run.timeMs : 0));
    const maxRuntimeMs = runtimes.length ? Math.max(...runtimes) : 0;

    const firstFailure = perCase.find((r) => r.passed !== true) || null;

    return res.json({
      problemId: problem.id,
      verdict: overallVerdict,
      totalPassed,
      totalCases,
      maxRuntimeMs,
      firstFailure,
      perCase,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    if (err instanceof JudgeBusyError) {
      return res.status(429).json({ error: err.message });
    }
    if (err instanceof JudgeUnavailableError) {
      return res.status(503).json({ error: err.message });
    }
    return next(err);
  }
});

module.exports = router;
