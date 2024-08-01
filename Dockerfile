FROM golang:1.22.5-bookworm

ARG DART_SASS_VERSION=1.77.8
ARG HUGO_VERSION=0.130.0

RUN apt-get -y update && apt-get -y install \
    ca-certificates \
    curl && \
    rm -rf /var/lib/apt/lists/*

RUN if [ "$(uname -m)" = "x86_64" ]; then \
  ARCH="amd64"; \
 elif [ "$(uname -m)" = "aarch64" ]; then \
  ARCH="arm64"; \
 else \
  echo "Unknown build architecture, quitting." && exit 2; \
 fi && \
curl -sSL "https://github.com/sass/dart-sass/releases/download/${DART_SASS_VERSION}/dart-sass-${DART_SASS_VERSION}-linux-${ARCH}.tar.gz" | tar -xzC /usr/local/ && \
curl -sSL "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_Linux-${ARCH}.tar.gz" | tar -xzC /usr/bin/ hugo

ENV PATH=$PATH:/usr/local/dart-sass

WORKDIR /app
