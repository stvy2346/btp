'use strict';

require('dotenv').config();

function intFromEnv(name, fallback) {
  const v = process.env[name];
  if (v === undefined || v === '') return fallback;
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? fallback : n;
}

const config = {
  port: intFromEnv('PORT', 4000),

  // Base URL of the sandbox judge's POST /execute endpoint (the cpp-sandbox
  // API from the uploaded judge project). Point this at wherever that
  // service is actually running.
  judgeUrl: process.env.JUDGE_URL || 'http://localhost:3000/execute',

  // Comma-separated list of allowed frontend origins, or "*" for any.
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // How many testcases to execute concurrently against the judge during a
  // /submit run. Keep this <= the judge's own MAX_CONCURRENT_EXECUTIONS.
  submitConcurrency: intFromEnv('SUBMIT_CONCURRENCY', 3),

  // How long to wait for the judge to respond before giving up on our side
  // (the judge has its own internal watchdog well under this).
  judgeTimeoutMs: intFromEnv('JUDGE_TIMEOUT_MS', 30_000),

  // Hard cap on submitted source size, enforced here too (in addition to
  // the judge's own limit) so we fail fast with a clear message.
  maxSourceBytes: intFromEnv('MAX_SOURCE_BYTES', 200 * 1024),

  // Requests allowed per IP per window on the execution endpoints.
  rateLimitWindowMs: intFromEnv('RATE_LIMIT_WINDOW_MS', 60_000),
  rateLimitMax: intFromEnv('RATE_LIMIT_MAX', 30),
};

module.exports = config;
