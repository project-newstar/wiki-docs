# [Choice] Debian version (use bullseye on local arm64/Apple Silicon): trixie, bookworm, bullseye, buster
ARG VARIANT="bookworm"
FROM buildpack-deps:${VARIANT}-curl

RUN apt-get update && \
    apt-get -y install --no-install-recommends git ca-certificates unzip wget curl && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# add bun
RUN curl -fsSL https://bun.sh/install | bash