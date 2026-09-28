# Runs the cpp-sandbox judge's Express API in its own container.
# It needs the `docker` CLI + the host's Docker socket so it can spawn one
# sandbox container per /execute request (Docker-outside-of-Docker), exactly
# as described in this judge's own README ("Option B").
FROM node:20-slim
RUN apt-get update && apt-get install -y --no-install-recommends docker.io && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --omit=dev
COPY server.js .
EXPOSE 3000
CMD ["node", "server.js"]
