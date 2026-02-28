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

## Demo
- `https://404.propertools.be/`

## Deploy targets
- **Demo:** GitHub Pages (e.g. `404.propertools.be`) using relative paths.
- **Production:** propertools.be (can be served as `/404.html` or as a routed 404 template).

## Contributing
Small PRs > big PRs.
If you’re unsure, please open an issue first.

## License
[MIT](https://github.com/propertools/404/blob/1048cc5511172328492f444c6fc43350b09a389e/LICENSE).
