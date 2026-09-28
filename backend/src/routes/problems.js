'use strict';

const express = require('express');
const { getProblem, listProblems } = require('../problems');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(listProblems());
});

router.get('/:id', (req, res) => {
  const problem = getProblem(req.params.id);
  if (!problem) {
    return res.status(404).json({ error: `No problem with id ${req.params.id}.` });
  }
  const { spec, ...rest } = problem;
  res.json({ ...rest, supportedLanguages: ['cpp'] });
});

module.exports = router;
