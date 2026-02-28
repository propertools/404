# Contributing to Proper Tools 404

Thank you for reading the source.

This repository is a deliberately static, dependency-free 404 artifact.
It is also a quiet recruiting surface.

Please keep contributions aligned with the spirit of the project.

---

## Ground Rules

- Static only. No build step.
- No external JS dependencies.
- No analytics, tracking, or beacons.
- No CDNs.
- Keep it readable for students.
- Keep it weird — but intentional.

If a change adds more than ~50KB of JavaScript, justify it clearly.

---

## Local Development

Preferred:

```bash
python3 -m http.server
````

Then open:

```
http://localhost:8000/
```

Opening `404.html` directly may work, but some browser features behave differently over `file://`.

---

## Architecture Philosophy

This page is evolving toward a small JavaScript “world.”

We prefer:

* Explicit state over DOM side effects
* Small, readable functions
* Clear naming
* A single source of truth for state

If you are adding behavior, consider:

* Does it introduce a new state?
* Should that state be part of the master state machine?
* Does it violate an invariant?

---

## Submitting a PR

Small PRs > large PRs.

If your change:

* Alters architecture
* Introduces new modes
* Changes state flow
* Adds a major feature

Please open an issue first.

---

## Style Notes

* Use modern, readable JavaScript.
* Avoid clever one-liners.
* Comment intent, not syntax.
* Prefer clarity over density.

---

## License

By contributing, you agree your contribution is licensed under MIT.

---
