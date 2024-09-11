FROM golang:1.22.5-bookworm

ARG DART_SASS_VERSION=1.77.8
ARG HUGO_VERSION=0.130.0
ARG NODE_VERSION=20.x

RUN apt-get -y update && apt-get -y install \
    ca-certificates \
    curl && \
    rm -rf /var/lib/apt/lists/*

RUN if [ "$(uname -m)" = "x86_64" ]; then \
  ARCH="amd64"; \
  ARCH_DART="x64"; \
 elif [ "$(uname -m)" = "aarch64" ]; then \
  ARCH="arm64"; \
  ARCH_DART="arm64"; \
 else \
  echo "Unknown build architecture, quitting." && exit 2; \
 fi && \
curl -sSL "https://github.com/sass/dart-sass/releases/download/${DART_SASS_VERSION}/dart-sass-${DART_SASS_VERSION}-linux-${ARCH_DART}.tar.gz" | tar -xzC /usr/local/ && \
curl -sSL "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_Linux-${ARCH}.tar.gz" | tar -xzC /usr/bin/ hugo && \
curl -fsSL "https://deb.nodesource.com/setup_${NODE_VERSION}" | bash - && \
apt-get install -y nodejs
ENV PATH=$PATH:/usr/local/dart-sass

WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install
