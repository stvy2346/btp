'use strict';

const express = require('express');
const { getProblem } = require('../problems');
const { evaluateTestCase } = require('../utils/evaluateTestCase');
const { JudgeUnavailableError, JudgeBusyError } = require('../judgeClient');
const config = require('../config');

const router = express.Router();

router.post('/:id/run', async (req, res, next) => {
  try {
    const { language, code, testCaseIndex, customInput } = req.body || {};

    if (typeof code !== 'string' || code.trim().length === 0) {
      return res.status(400).json({ error: '"code" is required and must be a non-empty string.' });
    }
    if (Buffer.byteLength(code, 'utf8') > config.maxSourceBytes) {
      return res.status(400).json({ error: `"code" exceeds the ${config.maxSourceBytes}-byte limit.` });
    }
    if (language && language !== 'cpp') {
      return res.status(501).json({
        error: `Language "${language}" is not supported yet. Only "cpp" is wired up to the ` +
          `currently configured judge; adding another language means building and running a ` +
          `matching sandbox image and pointing a new JUDGE_URL at it.`,
      });
    }

    const problem = getProblem(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: `No problem with id ${req.params.id}.` });
    }

    let testCaseInput;
    let expectedOutput;
    let caseNum;

    if (typeof customInput === 'string' && customInput.trim().length > 0) {
      testCaseInput = customInput;
      expectedOutput = null; // nothing to grade a custom run against
      caseNum = 'custom';
    } else {
      const idx = Number.isInteger(testCaseIndex) ? testCaseIndex : 0;
      const tc = problem.defaultTestCases[idx];
      if (!tc) {
        return res.status(400).json({
          error: `testCaseIndex ${idx} is out of range (problem ${problem.id} has ` +
            `${problem.defaultTestCases.length} default testcase(s)).`,
        });
      }
      testCaseInput = tc.input;
      expectedOutput = tc.expected;
      caseNum = idx + 1;
    }

    const result = await evaluateTestCase({
      spec: problem.spec,
      testCaseInput,
      expectedOutput,
      userCode: code,
      sortDepth: problem.spec.sortDepth || 0,
    });

    return res.json({
      problemId: problem.id,
      caseNum,
      ...result,
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
