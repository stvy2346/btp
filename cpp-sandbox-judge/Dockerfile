# Minimal, hardened C++ execution sandbox.
# All the actual security enforcement (network isolation, pids limit,
# read-only rootfs, capability drop, memory cap) happens at `docker run`
# time via CLI flags — see server.js / README. This image just provides
# the toolchain and a non-root user with nothing to escalate into.

FROM debian:bookworm-slim

# g++ on Debian 12 (bookworm) is GCC 12, which fully supports -std=c++20.
RUN apt-get update && \
    apt-get install -y --no-install-recommends g++ && \
    rm -rf /var/lib/apt/lists/*

# Fixed-UID, unprivileged service account: no login shell, no home
# directory, nothing to gain by escaping into "the container's user".
RUN groupadd -g 10001 sandbox && \
    useradd -u 10001 -g sandbox -M -s /usr/sbin/nologin sandbox

COPY sandbox-entrypoint.sh /usr/local/bin/sandbox-entrypoint.sh
RUN chmod 755 /usr/local/bin/sandbox-entrypoint.sh

# Some tools fall back to $HOME for scratch files; point it at the tmpfs
# that's actually writable at runtime instead of an unwritable "/".
ENV HOME=/tmp

USER sandbox:sandbox

ENTRYPOINT ["/usr/local/bin/sandbox-entrypoint.sh"]
