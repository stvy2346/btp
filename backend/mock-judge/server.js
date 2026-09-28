'use strict';

/**
 * DEV-ONLY mock of the cpp-sandbox judge's POST /execute contract.
 *
 * Compiles and runs submissions with the *host's own* g++, with no
 * container, no network isolation, no resource limits. This is here purely
 * so you can develop against the real backend API (this repo's src/server.js)
 * on a machine without Docker. It runs arbitrary code with zero sandboxing -
 * NEVER point a real deployment's JUDGE_URL at this. Use the actual
 * cpp-sandbox project (the hardened Docker judge) for anything but your own
 * local dev loop.
 */

const express = require('express');
const { execFile } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const app = express();
const PORT = process.env.MOCK_JUDGE_PORT || 3000;

app.use(express.json({ limit: '5mb' }));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/execute', (req, res) => {
  const { source_code: sourceCode, stdin = '' } = req.body || {};
  if (typeof sourceCode !== 'string' || !sourceCode) {
    return res.status(400).json({ status: 'error', message: 'source_code is required.' });
  }

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mock-judge-'));
  const srcPath = path.join(dir, 'sol.cpp');
  const binPath = path.join(dir, 'sol');
  fs.writeFileSync(srcPath, sourceCode);

  const startedAt = Date.now();

  execFile('g++', ['-std=c++20', '-O2', '-o', binPath, srcPath], { timeout: 10_000 }, (compileErr, cStdout, cStderr) => {
    const compileMs = Date.now() - startedAt;

    if (compileErr) {
      cleanup(dir);
      return res.json({
        status: compileErr.killed ? 'compile_timeout' : 'compile_error',
        message: compileErr.killed ? 'Compilation timed out.' : 'Compilation failed.',
        compile: { stdout: cStdout, stderr: cStderr, exitCode: compileErr.code ?? 1, timeMs: compileMs },
        timing: { totalMs: Date.now() - startedAt },
      });
    }

    const runStart = Date.now();
    const child = execFile(binPath, [], { timeout: 5000, maxBuffer: 10 * 1024 * 1024 }, (runErr, rStdout, rStderr) => {
      const runMs = Date.now() - runStart;
      cleanup(dir);

      if (runErr && runErr.killed) {
        return res.json({
          status: 'time_limit_exceeded',
          message: 'Execution exceeded the time limit.',
          compile: { stdout: cStdout, stderr: cStderr, exitCode: 0, timeMs: compileMs },
          run: { stdout: rStdout, stderr: rStderr, exitCode: null, signal: null, timeMs: runMs },
          timing: { totalMs: Date.now() - startedAt },
        });
      }

      const exitCode = runErr ? runErr.code ?? null : 0;
      const signal = runErr && runErr.signal ? runErr.signal : null;

      return res.json({
        status: exitCode === 0 ? 'success' : 'runtime_error',
        message: exitCode === 0 ? 'Program executed successfully.' : 'Program exited non-zero or crashed.',
        compile: { stdout: cStdout, stderr: cStderr, exitCode: 0, timeMs: compileMs },
        run: { stdout: rStdout, stderr: rStderr, exitCode, signal, timeMs: runMs },
        timing: { totalMs: Date.now() - startedAt },
      });
    });
    // The compiled program may exit (or never read stdin) before we finish
    // writing to it - that's normal, not an error, so swallow EPIPE here
    // instead of letting it crash the process as an unhandled 'error' event.
    child.stdin.on('error', (e) => {
      if (e.code !== 'EPIPE') throw e;
    });
    child.stdin.write(stdin);
    child.stdin.end();
  });
});

function cleanup(dir) {
  fs.rm(dir, { recursive: true, force: true }, () => {});
}

app.listen(PORT, () => console.log(`[mock-judge] listening on port ${PORT} (DEV ONLY, not sandboxed)`));
