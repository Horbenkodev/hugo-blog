# Setting up your environment

## Dev tools

### Install node dependencies

```bash
npm install
```

## Docker

```bash
docker compose build
docker compose up
```

## No Docker

### Install Go on macOS

```bash
brew install go
```

### Install Hugo on macOS

```bash
brew install hugo
```

### Install Dart Sass on macOS

```bash
brew install sass/sass/sass
```

#### Check that everything is installed

```bash
sass --embedded --version
```

```bash
{
  "protocolVersion": "2.5.0",
  "compilerVersion": "1.72.0",
  "implementationVersion": "1.72.0",
  "implementationName": "dart-sass",
  "id": 0
}
```

```bash
hugo env
```

```bash
hugo v0.123.8-5fed9c591b694f314e5939548e11cc3dcb79a79c+extended darwin/arm64 BuildDate=2024-03-07T13:14:42Z VendorInfo=brew
GOOS="darwin"
GOARCH="arm64"
GOVERSION="go1.22.1"
github.com/sass/libsass="3.6.5"
github.com/webmproject/libwebp="v1.3.2"
github.com/sass/dart-sass/protocol="2.5.0"
github.com/sass/dart-sass/compiler="1.72.0"
github.com/sass/dart-sass/implementation="1.72.0"
```

#### Start dev server

```bash
npm run dev
```

Web Server is available at `http://localhost:1313/`

## Useful links

[Netlify Docs](https://docs.netlify.com/)

[Redirects Playground](https://redirects-playground.netlify.app/)

[Making redirects work for you - troubleshooting and debugging](https://answers.netlify.com/t/support-guide-making-redirects-work-for-you-troubleshooting-and-debugging/13433)
