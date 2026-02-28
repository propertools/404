# Proper Tools 404

Static, weird, resilient.

This is the 404 page for propertools.be — and a small recruiting artifact for people who read source.

---

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

PRs welcome.

---

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

---

## The Proper Tools 404 Fellowship — 2026 Season

**Season runs:** 01 April – 31 August 2026
**Soft registration period:** now – 31 March 2026

Merged pull requests during the official season are eligible for Fellowship consideration.

Early contributors (pre-April) will be recognized as **Founding Chaos Participants**.

---

### Eligibility

* Submissions must be attributable to a real GitHub account associated with an individual.
* No anonymous or throwaway accounts.
* No corporate accounts — except mine. 😈
* All contributions must preserve the static-site nature of the project.
* No external dependencies.
* No analytics, tracking, or network calls.
* No obfuscated code.

If we have to ask whether it’s safe, it’s not.

---

### Adversarial / Playful Submissions

We welcome clever demonstrations of edge cases, playful “malice,” and red-team imagination — provided they are:

* Clearly labeled
* Transparent in intent
* Harmless
* Executable in a static browser environment
* Non-destructive

We do not execute encrypted archives.
We do not run unknown binaries.
We do not review obfuscated payloads.

Be clever.
Be elegant.
Be educational.

---

### Anti-Spam Rule

Multiple trivial PRs may be treated as a single contribution for evaluation purposes.

Small is fine.
Noise is not.

---

### Evaluation Model

Contributions are evaluated across four qualitative dimensions:

* **#awesome** — meh / wow / by Turing's beard
* **#craft** — loose / solid / surgical
* **#coherence** — random / aligned / disturbingly aligned
* **#entropy** — contained / playful / destabilizing

This is not a point system per say.
This is a classification system.

Elegant refactoring and simplification are subject to meaningful bonus, at my discretion.

---

### Conduct

Be respectful.
Be funny.
Be exquisite.
Be kind.

If you can’t manage all four, aim for at least two.

---
