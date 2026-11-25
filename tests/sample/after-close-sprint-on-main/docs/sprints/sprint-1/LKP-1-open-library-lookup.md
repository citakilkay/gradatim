# LKP-1 · Title and author from Open Library

Parent: [sprint 1](README.md)

| | |
|---|---|
| Status | `deferred` |
| Story | M4 |
| Depends on | BOK-1 |
| Takes | — |

## Goal

Shelf fills in a book's title and author from Open Library's ISBN and Authors APIs, paced within their limits, and retries when the device or Open Library is back (M4, D1, D2, D4).

## Scope

**In**
- The Open Library client for `/isbn/{isbn}.json` and `/authors/{key}.json`.
- The queue worker: one request at a time, at most one a second, backoff on errors and 429, a 404 as not found.
- Writing the title, authors and cover ID to the book, or marking it `not-found`.

**Out**
- Typing details by hand: BOK-2.
- Fetching the cover: COV-1.

## Acceptance criteria

- [ ] A book added offline shows its title and author once the network is back: a Playwright test.
- [ ] With Open Library stubbed as down, the lookup retries later; stubbed as not knowing the ISBN, the book is marked `not-found`.
- [ ] Unit tests on recorded responses show the pacing and the retries.

## Questions for the brainstorm

1. **Where does the worker run: the page or the service worker?** Proposed: the page, while Shelf is open; the service worker only caches.
2. **How many tries before a lookup gives up?** Proposed: it never gives up on errors, with backoff capped at an hour; only a 404 ends it.

## Documents to check on close

- [The MVP](../../MVP.md): M4's status.
- [The architecture](../../ARCHITECTURE.md)'s Seams, if the client differs.

## Log

| Date | Event |
|---|---|
| 2026-11-07 | Written by the new sprint step. |
| 2026-11-11 | Deferred by the close sprint step: `2026-11-11-LKP-1-open-library-lookup.md` carries what it still needs. |
