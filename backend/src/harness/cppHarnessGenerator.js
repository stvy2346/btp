'use strict';

const { CPP_PREAMBLE } = require('./cppPreamble');
const { toCppLiteral } = require('./cppSerializer');
const { parseNamedValues } = require('./valueParser');

/**
 * Builds the `int main() { ... }` that wires a single testcase's inputs into
 * the student's `Solution` class and prints the (JSON-flavoured) result.
 */
function buildMain(spec, namedValues) {
  const lines = [];
  const argNames = [];

  for (const param of spec.params) {
    if (!namedValues.has(param.name)) {
      throw new Error(
        `Testcase input is missing a value for parameter "${param.name}" ` +
          `(expected by problem spec, params: ${spec.params.map((p) => p.name).join(', ')})`
      );
    }
    const literal = toCppLiteral(namedValues.get(param.name), param.type);
    lines.push(`    ${param.type} ${param.name} = ${literal};`);
    argNames.push(param.name);
  }

  lines.push('    Solution sol;');

  if (spec.returns === null) {
    // void method that mutates one of its (reference) parameters in place.
    lines.push(`    sol.${spec.fn}(${argNames.join(', ')});`);
    lines.push(`    std::cout << toJson(${spec.mutatesParam}) << std::endl;`);
  } else {
    lines.push(`    auto __result = sol.${spec.fn}(${argNames.join(', ')});`);
    lines.push('    std::cout << toJson(__result) << std::endl;');
  }

  return ['int main() {', ...lines, '    return 0;', '}', ''].join('\n');
}

/**
 * Produces the full, compilable C++ source for one (problem, testcase,
 * submission) combination: harness preamble + student code + generated
 * main().
 */
function generateHarness({ spec, testCaseInput, userCode }) {
  const namedValues = parseNamedValues(testCaseInput);
  const mainSrc = buildMain(spec, namedValues);
  return [CPP_PREAMBLE, userCode.trim(), '', mainSrc].join('\n');
}

module.exports = { generateHarness, buildMain };
