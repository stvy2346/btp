'use strict';

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const config = require('./config');
const problemsRouter = require('./routes/problems');
const runRouter = require('./routes/run');
const submitRouter = require('./routes/submit');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(
  cors({
    origin: config.corsOrigin === '*' ? true : config.corsOrigin.split(',').map((s) => s.trim()),
  })
);
app.use(express.json({ limit: '2mb' }));

// Friendly JSON for malformed bodies instead of Express's HTML error page.
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Malformed JSON body.' });
  }
  next(err);
});

const executionLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions from this client; please slow down.' },
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/problems', problemsRouter);
app.use('/api/problems', executionLimiter, runRouter);
app.use('/api/problems', executionLimiter, submitRouter);

app.use((req, res) => res.status(404).json({ error: 'Not found.' }));
app.use(errorHandler);

if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`BTP judge backend listening on port ${config.port}`);
    console.log(`Forwarding executions to judge at ${config.judgeUrl}`);
  });
}

module.exports = app;
