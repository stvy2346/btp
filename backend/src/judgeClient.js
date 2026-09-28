'use strict';

const config = require('./config');

class JudgeUnavailableError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'JudgeUnavailableError';
    this.cause = cause;
  }
}

class JudgeBusyError extends Error {
  constructor(message) {
    super(message);
    this.name = 'JudgeBusyError';
  }
}

/**
 * Calls the sandbox judge's `POST /execute` with { source_code, stdin } and
 * returns its parsed JSON body (see the judge's README for the full shape:
 * status/message/compile/run/timing).
 *
 * Throws JudgeBusyError on HTTP 429 (judge at MAX_CONCURRENT_EXECUTIONS) and
 * JudgeUnavailableError if the judge can't be reached at all or times out —
 * both are distinct from a normal judged outcome (compile_error,
 * runtime_error, etc.), which always comes back as a 200 with a `status`
 * field and is returned as-is.
 */
async function executeOnJudge({ sourceCode, stdin = '' }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.judgeTimeoutMs);

  let response;
  try {
    response = await fetch(config.judgeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_code: sourceCode, stdin }),
      signal: controller.signal,
    });
  } catch (err) {
    throw new JudgeUnavailableError(
      `Could not reach the sandbox judge at ${config.judgeUrl}: ${err.message}`,
      err
    );
  } finally {
    clearTimeout(timeout);
  }

  if (response.status === 429) {
    throw new JudgeBusyError('The sandbox judge is at capacity; please retry shortly.');
  }

  let body;
  try {
    body = await response.json();
  } catch (err) {
    throw new JudgeUnavailableError('The sandbox judge returned a non-JSON response.', err);
  }

  if (!response.ok && body.status === undefined) {
    // Malformed-request class errors (400/413) from the judge itself, not a
    // judged program outcome.
    throw new Error(body.message || `Judge request failed with HTTP ${response.status}`);
  }

  return body;
}

module.exports = { executeOnJudge, JudgeUnavailableError, JudgeBusyError };
