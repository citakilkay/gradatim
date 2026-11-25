Status: open

# Title and author from Open Library, paced and retried

*Deferred at sprint 1's close, 2026-11-11. It came from LKP-1.*

## What it still needs

- The Open Library client for `/isbn/{isbn}.json` and `/authors/{key}.json` (M4, D1, D2).
- The queue worker: one request at a time, at most one a second, backoff on errors and 429, a 404 as not found (D4).
- Writing the title, authors and cover ID to the book, or marking it `not-found`, and retrying when the device or Open Library is back.
- Shown by: a Playwright test where a book added offline shows its title and author once the network is back; with Open Library stubbed as down, a later retry, and stubbed as not knowing the ISBN, `not-found`; unit tests on recorded responses for the pacing and the retries.
- Done already: nothing. It needs the queued lookup, `2026-11-11-BOK-1-add-by-isbn.md`, and the online status, `2026-11-11-APP-1-offline-app-shell.md`.

## Log

| Date | Event |
|---|---|
| 2026-11-11 | Written by sprint 1's close: `open`. |
