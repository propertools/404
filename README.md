# Proper Tools 404

Static, weird, resilient.

This is the 404 page for propertools.be — and a small recruiting artifact for people who read source.

PRs welcome.

## Rules of the game
- Keep it static. (No build step required.)
- No tracking. No analytics. No beacons.
- No _external_ JS dependencies.
- No crypto miners. No “free” CDNs.
- Keep it lightweight. If it adds >50KB of JS, justify it.

## Local test
Preferred:
- `python3 -m http.server` then open `http://localhost:8000/`

Works (usually):
- Open `404.html` directly in a browser.

## Demo / Integration Testing Server
- [https://404.propertools.be/](https://404.propertools.be/)

## Deploy targets
- **Demo:** GitHub Pages (e.g. `404.propertools.be`) using relative paths.
- **Production:** propertools.be (can be served as `/404.html` or as a routed 404 template).

## Contributing
Small PRs > big PRs.
If you’re unsure, please open an issue first.

## License
[MIT](./LICENSE)

## Supply Chain Transparency

This repository contains:
- 1 HTML file
- 1 CSS file
- 1 JS file
- 34 GIFs

There are no external JavaScript dependencies.
There is no build pipeline.
There is no package manager.
This project contains fewer moving parts than most SBOM generators.

If you find a transitive dependency, please file an issue.

![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)
