'use strict';

/**
 * Minimal synchronous C++ execution API.
 *
 * POST /execute { source_code, stdin? } spawns one ephemeral, hardened
 * Docker container per request, feeds it the source code and stdin over
 * the container's own stdin stream (no shared host filesystem, no bind
 * mounts — see sandbox-entrypoint.sh for the wire protocol), waits for it
 * to compile + run, and returns a structured JSON result.
 *
 * No user-controlled data ever appears in a docker CLI argument: source
 * code and stdin are streamed in, not passed as argv or a mounted path.
 * That sidesteps both shell/argument-injection concerns and the classic
 * Docker-outside-of-Docker bind-mount pitfall (a host path written by this
 * process is not necessarily visible to the Docker daemon).
 */

const express = require('express');
const { spawn, execFile } = require('child_process');
const crypto = require('crypto');

const app = express();

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 3000;
const DOCKER_IMAGE = process.env.SANDBOX_IMAGE || 'cpp-sandbox:latest';

const MAX_SOURCE_BYTES = 200 * 1024;      // 200 KB of source
const MAX_STDIN_BYTES = 1 * 1024 * 1024;  // 1 MB of program stdin
const MAX_CONCURRENT = parseInt(process.env.MAX_CONCURRENT_EXECUTIONS || '4', 10);

const CONTAINER_MEMORY = '256m';
const CONTAINER_PIDS_LIMIT = '64';
const COMPILE_TIMEOUT_SECONDS = 10;
const RUN_CPU_TIMEOUT_SECONDS = 2;

// Outer, host-side safety net. The container is expected to always self-
// terminate well before this (10s compile cap + 5s run wall-clock backstop
// + a couple seconds of container start/stop overhead). If we ever hit this,
// something inside the container is stuck in a way its own timeouts didn't
// catch, and we force-kill it from the outside.
const OUTER_WATCHDOG_MS = 25_000;

// Sentinel COMPILE_EXIT value the entrypoint script uses to signal a
// protocol-level failure (e.g. malformed stdin framing) rather than an
// actual g++ failure.
const INTERNAL_ERROR_SENTINEL = 90;

app.use(express.json({ limit: '5mb' }));

// Friendly JSON errors for bad bodies instead of Express's default HTML page.
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ status: 'error', message: 'Malformed JSON body.' });
  }
  if (err && err.type === 'entity.too.large') {
    return res.status(413).json({ status: 'error', message: 'Request body too large.' });
  }
  next(err);
});

let activeExecutions = 0;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SIGNAL_NAMES = { 4: 'SIGILL', 6: 'SIGABRT', 7: 'SIGBUS', 8: 'SIGFPE', 9: 'SIGKILL', 11: 'SIGSEGV' };
function signalName(n) {
  return SIGNAL_NAMES[n] || `SIG(${n})`;
}

function decodeB64(s) {
  if (!s) return '';
  try {
    return Buffer.from(s.trim(), 'base64').toString('utf8');
  } catch {
    return '';
  }
}

/**
 * Parse the "===MARKER===\n<value>" report the entrypoint script prints to
 * the container's stdout. Returns null if the report is missing/malformed
 * (e.g. docker itself failed before the container ever ran).
 */
function parseReport(stdout) {
  const markers = [
    'COMPILE_STDOUT', 'COMPILE_STDERR', 'COMPILE_EXIT', 'COMPILE_TIMEOUT', 'COMPILE_MS',
    'RUN_STDOUT', 'RUN_STDERR', 'RUN_EXIT', 'RUN_TIMEOUT', 'RUN_MS',
  ];
  const result = {};
  for (let i = 0; i < markers.length; i++) {
    const startTag = `===${markers[i]}===`;
    const endTag = i + 1 < markers.length ? `===${markers[i + 1]}===` : '===END===';
    const startIdx = stdout.indexOf(startTag);
    if (startIdx === -1) return null;
    const endIdx = stdout.indexOf(endTag, startIdx + startTag.length);
    if (endIdx === -1) return null;
    result[markers[i]] = stdout.slice(startIdx + startTag.length, endIdx).trim();
  }
  return result;
}

function dockerInspectOomKilled(containerName) {
  return new Promise((resolve) => {
    execFile('docker', ['inspect', '--format', '{{.State.OOMKilled}}', containerName], (err, stdout) => {
      if (err) return resolve(false);
      resolve(stdout.trim() === 'true');
    });
  });
}

function dockerRemove(containerName) {
  return new Promise((resolve) => {
    execFile('docker', ['rm', '-f', containerName], () => resolve());
  });
}

/**
 * Spawn the hardened sandbox container, stream in the framed payload
 * (source length, source bytes, then raw program stdin), and collect its
 * report. Resolves even on non-zero docker exit codes; only rejects if
 * `docker` itself could not be spawned at all.
 */
function runContainer(containerName, sourceCode, stdinData) {
  const dockerArgs = [
    'run',
    '-i',
    '--name', containerName,

    // --- Hardened security constraints ---
    '--network', 'none',                 // absolute network isolation
    '--cpus', '1',                       // bound wall-clock CPU availability
    '--pids-limit', CONTAINER_PIDS_LIMIT, // fork-bomb protection
    '--memory', CONTAINER_MEMORY,
    '--memory-swap', CONTAINER_MEMORY,   // identical to --memory => no swap
    '--read-only',                       // read-only root filesystem
    '--tmpfs', '/tmp:rw,exec,nosuid,nodev,size=64m,mode=1777',
    '--cap-drop', 'ALL',                 // drop every Linux capability
    '--security-opt', 'no-new-privileges:true',
    '--user', '10001:10001',             // non-root, matches image's `sandbox` user

    DOCKER_IMAGE,
  ];

  return new Promise((resolve, reject) => {
    const child = spawn('docker', dockerArgs, { stdio: ['pipe', 'pipe', 'pipe'] });

    const stdoutChunks = [];
    const stderrChunks = [];
    let settled = false;

    const watchdog = setTimeout(() => {
      if (settled) return;
      // The container's own compile/run timeouts should always fire first.
      // This is only a backstop against something stuck in a way they can't
      // catch (e.g. blocked in an uninterruptible syscall).
      child.kill('SIGKILL');
    }, OUTER_WATCHDOG_MS);

    child.stdout.on('data', (d) => stdoutChunks.push(d));
    child.stderr.on('data', (d) => stderrChunks.push(d));

    child.on('error', (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(watchdog);
      reject(new Error(`Failed to spawn docker: ${err.message}`));
    });

    child.on('close', async (dockerExitCode) => {
      if (settled) return;
      settled = true;
      clearTimeout(watchdog);

      const stdout = Buffer.concat(stdoutChunks).toString('utf8');
      const stderr = Buffer.concat(stderrChunks).toString('utf8');
      const report = parseReport(stdout);
      const oomKilled = await dockerInspectOomKilled(containerName);

      resolve({ dockerExitCode, report, rawStderr: stderr, oomKilled });
    });

    // Frame: "<byteLength>\n" + source bytes + raw program stdin bytes.
    const srcBuf = Buffer.from(sourceCode, 'utf8');
    const header = Buffer.from(`${srcBuf.length}\n`, 'utf8');
    const stdinBuf = Buffer.from(stdinData, 'utf8');
    child.stdin.write(header);
    child.stdin.write(srcBuf);
    child.stdin.end(stdinBuf);
  });
}

/**
 * Turn the raw container result into the public response shape, classifying
 * it into exactly one status: success, runtime_error, compile_error,
 * compile_timeout, time_limit_exceeded, memory_limit_exceeded,
 * compile_memory_exceeded, or internal_error.
 */
function buildResponse({ dockerExitCode, report, rawStderr, oomKilled }, startedAt) {
  const totalMs = Date.now() - startedAt;

  if (!report) {
    return {
      status: 'internal_error',
      message: 'Sandbox did not produce a recognizable result.',
      detail: (rawStderr || `docker exited with code ${dockerExitCode}`).slice(0, 2000),
      timing: { totalMs },
    };
  }

  const compileExit = parseInt(report.COMPILE_EXIT, 10);

  if (compileExit === INTERNAL_ERROR_SENTINEL) {
    return {
      status: 'internal_error',
      message: 'Sandbox rejected the request payload (malformed input framing).',
      timing: { totalMs },
    };
  }

  const compile = {
    stdout: decodeB64(report.COMPILE_STDOUT),
    stderr: decodeB64(report.COMPILE_STDERR),
    exitCode: compileExit,
    timeMs: parseInt(report.COMPILE_MS, 10) || 0,
  };

  if (compileExit !== 0) {
    if (report.COMPILE_TIMEOUT === 'true') {
      return {
        status: 'compile_timeout',
        message: `Compilation exceeded the ${COMPILE_TIMEOUT_SECONDS}s limit.`,
        compile,
        timing: { totalMs },
      };
    }
    if (oomKilled) {
      return {
        status: 'compile_memory_exceeded',
        message: `Compilation exceeded the ${CONTAINER_MEMORY} memory limit.`,
        compile,
        timing: { totalMs },
      };
    }
    return {
      status: 'compile_error',
      message: 'Compilation failed.',
      compile,
      timing: { totalMs },
    };
  }

  // Compilation succeeded — classify the run phase.
  const run = {
    stdout: decodeB64(report.RUN_STDOUT),
    stderr: decodeB64(report.RUN_STDERR),
    timeMs: parseInt(report.RUN_MS, 10) || 0,
  };

  if (report.RUN_TIMEOUT === 'true' && !oomKilled) {
    return {
      status: 'time_limit_exceeded',
      message: `Execution exceeded the ${RUN_CPU_TIMEOUT_SECONDS}s CPU time limit.`,
      compile,
      run: { ...run, exitCode: null, signal: null },
      timing: { totalMs },
    };
  }

  if (oomKilled) {
    return {
      status: 'memory_limit_exceeded',
      message: `Execution exceeded the ${CONTAINER_MEMORY} memory limit.`,
      compile,
      run: { ...run, exitCode: null, signal: null },
      timing: { totalMs },
    };
  }

  // `timeout`/bash report a signal-terminated child as exit code 128+signal.
  const rawExit = parseInt(report.RUN_EXIT, 10);
  let exitCode = rawExit;
  let signal = null;
  if (rawExit > 128) {
    signal = signalName(rawExit - 128);
    exitCode = null;
  }

  return {
    status: exitCode === 0 ? 'success' : 'runtime_error',
    message: exitCode === 0 ? 'Program executed successfully.' : 'Program exited non-zero or crashed.',
    compile,
    run: { ...run, exitCode, signal },
    timing: { totalMs },
  };
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/execute', async (req, res) => {
  const { source_code, stdin } = req.body || {};

  if (typeof source_code !== 'string' || source_code.length === 0) {
    return res.status(400).json({ status: 'error', message: 'source_code is required and must be a non-empty string.' });
  }
  if (Buffer.byteLength(source_code, 'utf8') > MAX_SOURCE_BYTES) {
    return res.status(400).json({ status: 'error', message: `source_code exceeds the ${MAX_SOURCE_BYTES}-byte limit.` });
  }

  const stdinData = stdin === undefined || stdin === null ? '' : stdin;
  if (typeof stdinData !== 'string') {
    return res.status(400).json({ status: 'error', message: 'stdin must be a string if provided.' });
  }
  if (Buffer.byteLength(stdinData, 'utf8') > MAX_STDIN_BYTES) {
    return res.status(400).json({ status: 'error', message: `stdin exceeds the ${MAX_STDIN_BYTES}-byte limit.` });
  }

  if (activeExecutions >= MAX_CONCURRENT) {
    return res.status(429).json({ status: 'error', message: 'Server is at capacity; please retry shortly.' });
  }

  activeExecutions++;
  const startedAt = Date.now();
  const containerName = `cpp-exec-${crypto.randomUUID()}`;

  try {
    const result = await runContainer(containerName, source_code, stdinData);
    return res.status(200).json(buildResponse(result, startedAt));
  } catch (err) {
    return res.status(500).json({
      status: 'internal_error',
      message: 'Sandbox execution failed.',
      detail: String(err && err.message ? err.message : err),
    });
  } finally {
    activeExecutions--;
    dockerRemove(containerName); // best-effort cleanup; container has no --rm so we control ordering with the OOM inspect above
  }
});

app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Not found.' });
});

// Final safety net so no uncaught error ever falls through to Express's
// default HTML error page.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ status: 'error', message: 'Internal server error.' });
});

if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`C++ sandbox API listening on port ${PORT} (image: ${DOCKER_IMAGE})`);
  });
  process.on('SIGTERM', () => server.close(() => process.exit(0)));
}

module.exports = app;
