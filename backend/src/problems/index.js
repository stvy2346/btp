'use strict';

const problemsData = require('./problemsData.json');
const { problemSpecs } = require('./problemSpecs');

const byId = new Map(problemsData.map((p) => [p.id, p]));

function getProblem(id) {
  const numId = Number(id);
  const data = byId.get(numId);
  const spec = problemSpecs[numId];
  if (!data || !spec) return null;
  return { ...data, spec };
}

function listProblems() {
  return problemsData.map(({ id, title, defaultTestCases }) => ({
    id,
    title,
    testCaseCount: defaultTestCases.length,
    supportedLanguages: problemSpecs[id] ? ['cpp'] : [],
  }));
}

module.exports = { getProblem, listProblems };
