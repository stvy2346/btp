# BTP online judge — backend layer

Wires the LeetCode-style frontend (`stvy2346/btp`) to the C++ sandbox judge
you already have, by doing the part neither of those two pieces does on its
own: turning a student's `class Solution { ... }` submission into a
compilable program, running it against each problem's testcases, and
grading the result.

```
 ┌──────────────┐   POST /api/problems/:id/run      ┌──────────────┐   POST /execute      ┌───────────────────┐
 │   Frontend   │   POST /api/problems/:id/submit   │   backend/   │  { source_code,      │ cpp-sandbox-judge/ │
 │ (React/Vite) │ ─────────────────────────────────▶│ (this repo)  │─── stdin }──────────▶│ (your uploaded     │
 │              │◀───────────────────────────────── │              │◀───────────────────  │  sandbox judge)    │
 └──────────────┘        graded JSON result          └──────────────┘   compile/run result  └───────────────────┘
```

- **`cpp-sandbox-judge/`** — an unmodified copy of the sandbox you uploaded
  (Dockerfile + entrypoint + Express API). It only knows how to compile and
  run one self-contained C++ file and hand back stdout/stderr/timing. It has
  no idea what "Two Sum" is.
- **`backend/`** — new. This is what you asked for. It knows about the 50
  problems, generates the C++ harness around each submission, calls the
  judge, and grades the output.

## Why a harness, not just "run the code"

The frontend's problems are LeetCode-style: the student fills in a method
body inside `class Solution`, not a whole program that reads stdin. The
judge, on the other hand, only knows how to run a complete `main()`. The
backend bridges that gap per submission:

1. Parse the testcase's `"nums = [2,7,11,15]\ntarget = 9"` style input into
   real values.
2. Render those values as C++ literals matching the problem's real
   parameter types (`std::vector<int>`, `ListNode*`, `std::vector<std::vector<char>>`, ...).
3. Prepend a small preamble (JSON-style serialization helpers, `ListNode`
   struct + `buildList`) and append a generated `main()` that constructs the
   arguments, calls the student's method, and prints the result the same way
   the problem bank's `expected` values are written (`[0,1]`, `"bab"`, `true`,
   `2.00000`, ...).
4. Send the whole file to the judge's `POST /execute`.
5. Parse both the expected and actual output as JSON and diff them — with
   float tolerance, and with order-independent comparison for problems like
   3Sum, permutations, and group anagrams where more than one output
   ordering is valid.

All 50 problems' generated harnesses are verified to compile (see
`backend/src/problems/problemSpecs.js` for the per-problem signature table),
and a representative subset spanning every parameter/return type (arrays,
nested arrays, linked lists, `vector<ListNode*>`, mutate-in-place `void`
methods, char matrices, doubles) has been verified end-to-end against real
reference solutions.

## Project layout

```
.
├── cpp-sandbox-judge/       # your judge, unmodified (+ a Dockerfile for its API)
├── backend/                 # the new backend layer
│   ├── src/
│   │   ├── server.js            # Express app + routes
│   │   ├── config.js            # env-driven config
│   │   ├── judgeClient.js       # calls the judge's POST /execute
│   │   ├── harness/
│   │   │   ├── valueParser.js       # "nums = [1,2]\ntarget = 3" -> JS values
│   │   │   ├── compare.js           # float-tolerant, order-independent diff
│   │   │   ├── cppSerializer.js     # JS value -> C++ literal
│   │   │   ├── cppPreamble.js       # shared helpers injected into every submission
│   │   │   └── cppHarnessGenerator.js
│   │   ├── problems/
│   │   │   ├── problemSpecs.js      # per-problem fn name / params / return type
│   │   │   ├── problemsData.json    # testcases, copied from the frontend's mock data
│   │   │   └── index.js
│   │   ├── routes/{problems,run,submit}.js
│   │   └── utils/evaluateTestCase.js
│   └── mock-judge/server.js    # DEV-ONLY stand-in for the judge (see below)
└── docker-compose.yml
```

## Running it

### Option A — Docker (recommended, uses the real sandbox)

```bash
# One-time: build the worker image the judge executes submissions in.
# This has to be run against the host's own Docker, so compose can't do it
# for you as part of `up`.
docker build -t cpp-sandbox:latest ./cpp-sandbox-judge

# Build + start the judge's API and this backend.
docker compose up --build
```

This starts:
- `cpp-sandbox-api` on `:3000` (the judge you uploaded, unmodified)
- `backend` on `:4000` (this project), pointed at the judge automatically

Then run the frontend separately (`cd frontend && npm run dev`, default
`http://localhost:5173`) and see "Frontend integration" below.

### Option B — no Docker (local dev loop)

The judge needs Docker to sandbox anything, so for a quick dev loop without
it, `backend/mock-judge/server.js` speaks the exact same `POST /execute`
contract but compiles/runs with your machine's own `g++` — no container, no
sandboxing, no resource limits. **Never use it for anything but your own
local development.**

```bash
cd backend
npm install
node mock-judge/server.js &      # pretend-judge on :3000
JUDGE_URL=http://localhost:3000/execute npm start   # real backend on :4000
```

### Environment variables (`backend/.env` or your process manager)

| Var | Default | Meaning |
|---|---|---|
| `PORT` | `4000` | port this backend listens on |
| `JUDGE_URL` | `http://localhost:3000/execute` | the judge's `/execute` endpoint |
| `CORS_ORIGIN` | `http://localhost:5173` | allowed frontend origin(s), comma-separated, or `*` |
| `SUBMIT_CONCURRENCY` | `3` | testcases run in parallel per `/submit` (keep ≤ judge's `MAX_CONCURRENT_EXECUTIONS`) |
| `MAX_SOURCE_BYTES` | `204800` | reject larger submissions before ever touching the judge |
| `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_MS` | `30` / `60000` | per-IP throttle on `/run` and `/submit` |

## API reference

### `GET /api/problems`
List of `{ id, title, testCaseCount, supportedLanguages }`.

### `GET /api/problems/:id`
One problem's testcases + starter code (as copied from the frontend's mock data).

### `POST /api/problems/:id/run`
Run one testcase (or free-form custom input) and grade it if there's ground truth to grade against.

```jsonc
// request
{
  "language": "cpp",          // only "cpp" is wired up right now
  "code": "class Solution { ... };",
  "testCaseIndex": 0          // OR: "customInput": "nums = [5,5,11]\ntarget = 10"
}
```
```jsonc
// response
{
  "problemId": 1,
  "caseNum": 1,                          // or "custom"
  "verdict": "Accepted",                 // Accepted | Wrong Answer | Compile Error |
                                          // Runtime Error | Time Limit Exceeded |
                                          // Memory Limit Exceeded | Internal Error | Executed
  "input": "nums = [2,7,11,15]\ntarget = 9",
  "expectedOutput": "[0,1]",             // null for a custom-input run
  "actualOutput": "[0,1]",
  "passed": true,                        // null for a custom-input run (nothing to grade against)
  "message": "Output matches expected result.",
  "compile": { "stdout": "", "stderr": "", "exitCode": 0, "timeMs": 340 },
  "run": { "stdout": "[0,1]\n", "stderr": "", "exitCode": 0, "signal": null, "timeMs": 4 }
}
```

### `POST /api/problems/:id/submit`
Run every default testcase for the problem.

```jsonc
// request
{ "language": "cpp", "code": "class Solution { ... };" }
```
```jsonc
// response
{
  "problemId": 1,
  "verdict": "Accepted",
  "totalPassed": 3,
  "totalCases": 3,
  "maxRuntimeMs": 6,
  "firstFailure": null,   // the first non-passing case's full result, if any
  "perCase": [ /* one entry per testcase, same shape as /run's response */ ],
  "timestamp": "2026-09-27T16:42:37.846Z"
}
```
If the code doesn't compile, only one judge call is made (a compile failure
is a property of the code, not the testcase, so it's the same for all of
them) — `perCase` will have a single entry and `verdict` will be
`"Compile Error"`.

## Frontend integration

`frontend/src/pages/QuestionPage.jsx` currently fakes both `handleRunCode`
and `handleSubmitCode` with a `setTimeout` that always reports success. Swap
them for real calls:

```jsx
const API_BASE = "http://localhost:4000"; // move to an env var in a real build

const handleRunCode = async () => {
  setIsRunning(true);
  setActiveBottomView("result");
  setRunResult(null);

  const body =
    testcaseTab === "custom"
      ? { language: selectedLanguage, code, customInput: customInput }
      : { language: selectedLanguage, code, testCaseIndex: testcaseTab };

  try {
    const res = await fetch(`${API_BASE}/api/problems/${problem.id}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setRunResult({
      status: data.verdict,
      caseNum: data.caseNum,
      input: data.input,
      expectedOutput: data.expectedOutput,
      actualOutput: data.actualOutput ?? data.message,
      runtime: data.run ? `${data.run.timeMs} ms` : "—",
      memory: "—", // the judge enforces a memory cap but doesn't report usage
      stdout: data.run?.stdout ?? "",
      stderr: data.run?.stderr || data.compile?.stderr || "",
    });
  } catch (err) {
    setRunResult({ status: "Internal Error", actualOutput: String(err) });
  } finally {
    setIsRunning(false);
  }
};

const handleSubmitCode = async () => {
  setIsSubmitting(true);
  setActiveBottomView("result");
  setSubmitResult(null);

  try {
    const res = await fetch(`${API_BASE}/api/problems/${problem.id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: selectedLanguage, code }),
    });
    const data = await res.json();
    setSubmitResult({
      status: data.verdict,
      totalPassed: data.totalPassed,
      totalCases: data.totalCases,
      runtime: `${data.maxRuntimeMs} ms`,
      memory: "—",
      timestamp: new Date(data.timestamp).toLocaleTimeString(),
      firstFailure: data.firstFailure,
    });
  } catch (err) {
    setSubmitResult({ status: "Internal Error" });
  } finally {
    setIsSubmitting(false);
  }
};
```

**One thing worth fixing while you're in there:** the current result cards
in `QuestionPage.jsx` are hardcoded to always render the green "Accepted" /
"Run Succeeded" state regardless of what's in `runResult.status` /
`submitResult.status` — reasonable for a mock, but with a real backend
you'll want to branch on `status !== "Accepted"` to show a red Wrong
Answer / Compile Error state (and surface `stderr` for compile errors,
which students will need to see).

### Languages

Only `"cpp"` is wired up, because that's the only sandbox you provided.
`/run` and `/submit` return `501` for anything else. To add another
language you'd need a matching sandbox image + judge instance and a second
harness generator (the value-parsing and comparison logic in
`harness/valueParser.js` and `harness/compare.js` is language-agnostic and
would carry over; only `cppSerializer.js`, `cppPreamble.js`, and
`cppHarnessGenerator.js` are C++-specific).

## Known limitations

- **One judge round-trip per testcase.** The sandbox judge compiles fresh
  source on every `/execute` call (there's no separate compile-once /
  run-many API), so `/submit` on a problem with N testcases means N
  compiles of near-identical code. `submit.js` short-circuits after the
  first testcase if it doesn't compile, and runs the rest with limited
  concurrency, but this is still the main cost driver — fine for a class
  project, worth revisiting if this ever needs to serve a large cohort.
- **No memory reporting.** The judge enforces a 256MB cap but only reports
  *that it was hit*, not actual peak usage, so there's no real number to
  show next to "Memory" in the UI.
- **Order-independent grading is a per-problem flag, not automatic.** It's
  set correctly for all 50 problems in this bank (`sortDepth` in
  `problemSpecs.js`), but if you add a new problem with more than one valid
  output ordering, you need to set that flag yourself.
- **`ListNode`/`vector<ListNode*>` and matrix types are covered; `TreeNode`
  is not** (no problem in the current 50 needs it) — the preamble in
  `cppPreamble.js` is the place to add it if you extend the problem bank.
- Two of the frontend's bundled testcases (**Valid Sudoku** and **Sudoku
  Solver**) had a literal `"[[...]]"` placeholder instead of real board
  data in the frontend's mock data; `backend/src/problems/problemsData.json`
  replaces both with a real, independently-verified puzzle/solution pair,
  but the frontend's own `mockProblems.js` (used for the problem
  description/display) still has the placeholder — only cosmetic, since the
  backend's copy is what's actually graded against, but worth syncing if
  you want the testcase preview panel to show real data too.
