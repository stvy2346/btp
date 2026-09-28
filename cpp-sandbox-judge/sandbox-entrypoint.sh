#!/bin/bash
#
# Runs as PID 1 inside the ephemeral, network-isolated sandbox container.
# Nothing about this script is trusted with secrets: it only ever touches
# the 64MB tmpfs at /tmp (the rest of the filesystem is read-only).
#
# ---- Input protocol (read from container stdin, written by the Node API) ----
#   line 1        : decimal byte-length N of the C++ source code
#   next N bytes  : the C++ source code itself (main.cpp)
#   remainder     : raw bytes fed to the compiled program's own stdin
#
# Reading N bytes off a pipe, then continuing to read from the very same fd,
# is safe: pipes are sequential, so whatever `head -c N` doesn't consume is
# exactly what's left for `./a.out` to read later. No shared host filesystem
# is required for any of this.
#
# ---- Output protocol (written to container stdout) ----
# A flat list of "===MARKER===" sections, each followed by its value. Binary
# blobs (compiler/program stdout+stderr) are base64-encoded so they can never
# collide with a marker string or contain unescaped control characters.

set -u
WORK=/tmp/box
mkdir -p "$WORK"
cd "$WORK" || exit 90

b64() { base64 -w0 "$1" 2>/dev/null; }
now_ms() { date +%s%3N; }

# Sentinel exit code 90 = "sandbox protocol/internal error", distinct from any
# real g++ or program exit code. The Node API special-cases it.
fail_internal() {
  echo "===COMPILE_STDOUT==="
  echo "===COMPILE_STDERR==="
  echo "===COMPILE_EXIT==="; echo "90"
  echo "===COMPILE_TIMEOUT==="; echo "false"
  echo "===COMPILE_MS==="; echo "0"
  echo "===RUN_STDOUT==="
  echo "===RUN_STDERR==="
  echo "===RUN_EXIT==="
  echo "===RUN_TIMEOUT==="; echo "false"
  echo "===RUN_MS==="; echo "0"
  echo "===END==="
  exit 90
}

read -r SRC_LEN || fail_internal
case "$SRC_LEN" in
  '' | *[!0-9]*) fail_internal ;;
esac
head -c "$SRC_LEN" > main.cpp

# ---------------- Compile phase ----------------
# 10s wall-clock cap, -O2, C++20, as specified. SIGKILL is used directly so
# the exit code convention (128+9=137) unambiguously flags "timed out".
T0=$(now_ms)
timeout -s KILL 10s g++ -std=c++20 -O2 -o a.out main.cpp \
  >compile_stdout.txt 2>compile_stderr.txt
COMPILE_EXIT=$?
T1=$(now_ms)
COMPILE_MS=$((T1 - T0))
COMPILE_TIMEOUT=false
[ "$COMPILE_EXIT" -eq 137 ] && COMPILE_TIMEOUT=true

RUN_EXIT=""
RUN_MS=0
RUN_TIMEOUT=false
: > run_stdout.txt
: > run_stderr.txt

if [ "$COMPILE_EXIT" -eq 0 ]; then
  # ---------------- Run phase ----------------
  # ulimit -t is RLIMIT_CPU in whole seconds: a precise *CPU-time* cap, as
  # opposed to wall-clock. The surrounding `timeout -s KILL 5s` is a wall
  # clock backstop for processes that block (e.g. waiting on I/O) without
  # burning CPU, which RLIMIT_CPU alone would never catch.
  T1b=$(now_ms)
  ( ulimit -t 2; exec timeout -s KILL 5s ./a.out ) <&0 >run_stdout.txt 2>run_stderr.txt
  RUN_EXIT=$?
  T2=$(now_ms)
  RUN_MS=$((T2 - T1b))
  [ "$RUN_EXIT" -eq 137 ] && RUN_TIMEOUT=true
fi

echo "===COMPILE_STDOUT==="; b64 compile_stdout.txt
echo "===COMPILE_STDERR==="; b64 compile_stderr.txt
echo "===COMPILE_EXIT==="; echo "$COMPILE_EXIT"
echo "===COMPILE_TIMEOUT==="; echo "$COMPILE_TIMEOUT"
echo "===COMPILE_MS==="; echo "$COMPILE_MS"
echo "===RUN_STDOUT==="; b64 run_stdout.txt
echo "===RUN_STDERR==="; b64 run_stderr.txt
echo "===RUN_EXIT==="; echo "$RUN_EXIT"
echo "===RUN_TIMEOUT==="; echo "$RUN_TIMEOUT"
echo "===RUN_MS==="; echo "$RUN_MS"
echo "===END==="
