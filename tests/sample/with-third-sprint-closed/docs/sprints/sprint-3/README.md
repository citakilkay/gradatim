# Sprint 3

Parent: [the architecture](../../ARCHITECTURE.md)

| | |
|---|---|
| Status | `closed 2026-11-14` |
| Opened | 2026-11-14 |
| Goal | A reader adds a book with the network off, and every page Shelf serves carries its security headers. |
| Capacity | 0.75 of about 5 to 8 dev-days |

## Scope

The sprint takes the review's pick, M10, and security headers for the hosting, across two modules: books (`BOK`) and hosting and release (`OPS`). It holds 0.75 dev-days, far under the band of 5 to 8, at the user's word: they want both out in a second release, after 0.1.0, before the lookup's two dev-days. So the three deferred items and the open issue, which come first by the rules, wait for the next sprint, at the user's word.

- BOK-4 takes M10, at its estimate: the Add button stays on with the network off.
- OPS-3 is a setup task for the MVP, since the hosting module names no story: `static/_headers`, which Cloudflare Pages reads.
- Left: `2026-11-11-LKP-1-open-library-lookup.md`, `2026-11-11-BOK-2-manual-details.md` and `2026-11-11-COV-1-stored-covers.md`, and the open issue, `2026-11-09-OPS-2-preview-footer-pr-number.md`, at the user's word.

## Board

| Task | Title | Story | Depends on | Days | Status |
|---|---|---|---|---|---|
| [BOK-4](BOK-4-add-a-book-offline.md) | Add a book with the network off | M10 | — | 0.25 | `completed` |
| [OPS-3](OPS-3-security-headers.md) | Security headers on every page | the MVP | — | 0.5 | `completed` |

## Log

| Date | Event |
|---|---|
| 2026-11-14 | Opened by the new sprint step: BOK-4, OPS-3, 0.75 dev-days, at the user's word |
| 2026-11-14 | Build started by the build task step, on `main`, with no branch of its own. |
| 2026-11-14 | BOK-4 closed by the close task step: `completed`. |
| 2026-11-14 | Build started by the build task step, on `main`, with no branch of its own. |
| 2026-11-14 | OPS-3 closed by the close task step: `completed`. |
| 2026-11-14 | Closed by the close sprint step: BOK-4, OPS-3 `completed`. Delivered: M10. Check: the gate passed on the sprint's final state, its Playwright tests at a desktop's and a phone's width; M10 shown by `e2e/add-book-offline.test.ts`, and the headers by `src/lib/security-headers.test.ts`, which reads `static/_headers`. Open: `2026-11-09-OPS-2-preview-footer-pr-number.md`, `2026-11-11-BOK-2-manual-details.md`, `2026-11-11-COV-1-stored-covers.md` and `2026-11-11-LKP-1-open-library-lookup.md`. Taught: a sprint of two small tasks closed in a day, so a short sprint before a release works where the user wants one. |
