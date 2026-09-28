# C++ Sandbox — minimal Docker-based execution backend

A synchronous `POST /execute` API that compiles and runs untrusted C++20
inside a fresh, hardened, network-isolated Docker container per request.
No Judge0, no queue, no database — one container in, one JSON result out.

```
cpp-sandbox/
├── sandbox-image/
│   ├── Dockerfile              # the worker image (g++ + non-root user)
│   └── sandbox-entrypoint.sh   # compiles + runs inside the container
├── api/
│   ├── server.js               # Express API
│   └── package.json
└── README.md
```

## How it works

1. The API validates the request and streams the source code straight into
   `docker run -i`'s stdin — **no file is written to the host and no volume
   is bind-mounted.** This matters: if the API itself runs inside a
   container (see "Running the API" below), a path on the API container's
   filesystem is *not* visible to the Docker daemon on the host, so bind
   mounts are a common source of confusing failures in this deployment
   model. Streaming sidesteps it entirely and also means no user input ever
   appears as a `docker` CLI argument.
2. Inside the container, `sandbox-entrypoint.sh` reads a small length-prefixed
   frame off stdin (`"<byte-length>\n" + source + raw program stdin`),
   writes the source to the container's own 64MB tmpfs, compiles it, runs
   it with the remaining stdin bytes, and prints a marker-delimited,
   base64-encoded report to its stdout.
3. The API parses that report, cross-checks `docker inspect` for an OOM
   kill, and returns structured JSON.

## 1. Build the sandbox image

```bash
cd sandbox-image
docker build -t cpp-sandbox:latest .
```

## 2. Run the API

The API shells out to the `docker` CLI for every request, so it needs a
`docker` binary on `PATH` and access to a Docker daemon. Two ways to do that:

### Option A — run the API directly on the host (simplest, recommended)

If Docker Engine is already installed on the machine, just run the API as a
normal Node process there — no socket-mounting needed at all.

```bash
cd api
npm install
SANDBOX_IMAGE=cpp-sandbox:latest node server.js
```

### Option B — run the API in its own container (Docker-outside-of-Docker)

If you'd rather containerize the API too, give its container the `docker`
CLI and mount the host's Docker socket into it:

```dockerfile
# api/Dockerfile
FROM node:20-slim
RUN apt-get update && apt-get install -y --no-install-recommends docker.io && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
COPY server.js .
EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
docker build -t cpp-sandbox-api:latest ./api
docker run -d --name cpp-sandbox-api \
  -p 3000:3000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e SANDBOX_IMAGE=cpp-sandbox:latest \
  cpp-sandbox-api:latest
```

> **Important:** mounting `/var/run/docker.sock` gives that container the
> ability to create *any* container on the host — it is effectively
> root-equivalent access to the host. That's fine because the API code is
> trusted; it's the *C++ submissions* that are untrusted and never touch the
> socket directly. But it means this API container itself must never be
> exposed to untrusted networks without its own auth layer in front, and it
> should be treated as a privileged component operationally (logging,
> restricted access, etc.).

Either way, `docker build -t cpp-sandbox:latest ./sandbox-image` must have
been run first so the image the API references actually exists.

## Request / response schema

### `POST /execute`

```jsonc
{
  "source_code": "string, required — the C++20 source of a single translation unit",
  "stdin": "string, optional, default \"\" — piped to the compiled program's stdin"
}
```

Limits: `source_code` ≤ 200 KB, `stdin` ≤ 1 MB. Both enforced server-side
before a container is ever started.

### Response

Always `200 OK` with a JSON body for anything the sandbox itself handled
(compile errors, crashes, timeouts included — those are normal outcomes,
not HTTP errors). `400`/`413`/`429` are used only for malformed requests,
oversized bodies, or the server being at its concurrency limit; `500` only
for sandbox infrastructure failure.

```ts
{
  status:
    | "success"                 // compiled and exited 0
    | "runtime_error"           // compiled, but exited non-zero or crashed (signal)
    | "compile_error"           // g++ failed (not a timeout)
    | "compile_timeout"         // compilation exceeded 10s
    | "time_limit_exceeded"     // execution exceeded the 2s CPU limit
    | "memory_limit_exceeded"   // execution exceeded 256MB (OOM-killed)
    | "compile_memory_exceeded" // compilation exceeded 256MB (OOM-killed)
    | "internal_error",         // sandbox/infra failure, not the submission's fault
  message: string,
  compile?: { stdout: string, stderr: string, exitCode: number, timeMs: number },
  run?: {
    stdout: string,
    stderr: string,
    exitCode: number | null,   // null when the process was killed by a signal
    signal: string | null,     // e.g. "SIGSEGV", set only on a signal death
    timeMs: number
  },
  timing: { totalMs: number }
}
```

`compile` is present whenever compilation was attempted; `run` is present
whenever the compiled binary was actually started. Both are omitted from
`internal_error` responses where neither necessarily ran.

### Example: success

```json
{
  "status": "success",
  "message": "Program executed successfully.",
  "compile": { "stdout": "", "stderr": "", "exitCode": 0, "timeMs": 378 },
  "run": { "stdout": "Hello, Claude!\n", "stderr": "", "exitCode": 0, "signal": null, "timeMs": 4 },
  "timing": { "totalMs": 405 }
}
```

### Example: runtime crash

```json
{
  "status": "runtime_error",
  "message": "Program exited non-zero or crashed.",
  "compile": { "stdout": "", "stderr": "", "exitCode": 0, "timeMs": 46 },
  "run": { "stdout": "", "stderr": "", "exitCode": null, "signal": "SIGSEGV", "timeMs": 12 },
  "timing": { "totalMs": 75 }
}
```

### Example: CPU time limit exceeded

```json
{
  "status": "time_limit_exceeded",
  "message": "Execution exceeded the 2s CPU time limit.",
  "compile": { "stdout": "", "stderr": "", "exitCode": 0, "timeMs": 40 },
  "run": { "stdout": "", "stderr": "", "exitCode": null, "signal": null, "timeMs": 2004 },
  "timing": { "totalMs": 2062 }
}
```

### curl

```bash
curl -X POST http://localhost:3000/execute \
  -H 'Content-Type: application/json' \
  -d '{
    "source_code": "#include <iostream>\n#include <string>\nint main(){std::string n; std::getline(std::cin,n); std::cout<<\"Hello, \"<<n<<\"!\\n\";}",
    "stdin": "World\n"
  }'
```

## Security constraints → what they mitigate

| Flag | Mitigates |
|---|---|
| `--network none` | Exfiltration, SSRF, reaching internal services, downloading second-stage payloads |
| `--pids-limit 64` | Fork bombs / process-table exhaustion |
| `--read-only` + `--tmpfs /tmp:...,size=64m` | Persisting files, tampering with the image, filling host disk |
| `--cap-drop ALL` | Anything needing `CAP_SYS_ADMIN`, `CAP_NET_RAW`, etc. — mount tricks, raw sockets, ptrace |
| `--security-opt no-new-privileges:true` | setuid/setgid binaries escalating privileges inside the container |
| `--user 10001:10001` (non-root) | Reduces blast radius of any container-boundary bug; nothing runs as root even before namespacing |
| `--memory 256m --memory-swap 256m` | Memory-exhaustion DoS against the host |
| `ulimit -t 2` (CPU seconds) + `timeout -s KILL` wall-clock backstop | Infinite loops / runaway CPU use, including ones that also block on I/O |
| Streamed stdin, no bind mounts, no user data in argv | Host-path confusion under Docker-outside-of-Docker; argument/shell injection |

## Known limitations

- **Standard runc isolation, not a VM.** This relies on Linux namespaces +
  cgroups, the same boundary Docker always uses. It's a good, standard
  sandbox, but a kernel container-escape exploit would still apply. For a
  stronger boundary (e.g. genuinely adversarial, high-stakes multi-tenant
  use), consider swapping the container runtime for gVisor (`runsc`) or
  Kata Containers — both are drop-in `--runtime` changes, nothing else here
  needs to change.
- **Compile and run share one memory/PID budget.** Both phases happen in
  the same container for simplicity, so the 256MB/64-pid limits apply to
  compilation too (rarely an issue for typical submissions, but a template-
  metaprogramming-heavy file could in principle hit it).
- **OOM vs. timeout disambiguation is best-effort.** Both end in the same
  `exit 137`; the API cross-checks `docker inspect .State.OOMKilled` to
  tell them apart, but exact OOM attribution can vary slightly by Docker/
  cgroup version. Worth a quick empirical check in your environment.
- **No authentication or per-client rate limiting.** Only a blunt global
  `MAX_CONCURRENT_EXECUTIONS` (default 4) guards against unbounded parallel
  `docker run` calls. Put this behind your own auth/gateway before exposing
  it publicly.
- **No orphan-container cleanup daemon.** The API removes each container
  itself once it's done inspecting it, but if the API process is killed
  mid-request a container could be left behind. A simple cron doing
  `docker ps -a --filter name=cpp-exec- --filter status=exited -q | xargs -r docker rm`
  covers this in production.
