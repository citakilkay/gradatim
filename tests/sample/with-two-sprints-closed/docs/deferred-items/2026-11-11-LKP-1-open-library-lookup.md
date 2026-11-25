Status: open

# Title and author from Open Library, paced and retried

*Deferred at sprint 1's close, 2026-11-11. It came from LKP-1.*

## What it still needs

- The Open Library client for `/isbn/{isbn}.json` and `/authors/{key}.json` (M4, D1, D2).
- The queue worker: one request at a time, at most one a second, backoff on errors and 429, a 404 as not found (D4).
- Writing the title, authors and cover ID to the book, or marking it `not-found`, and retrying when the device or Open Library is back.
- Shown by: a Playwright test where a book added offline shows its title and author once the network is back; with Open Library stubbed as down, a later retry, and stubbed as not knowing the ISBN, `not-found`; unit tests on recorded responses for the pacing and the retries.
- Done already: the queue it drains, the `lookups` table with each entry's tries and next try, which BOK-3 fills as each book is added; and the online status to watch, `src/lib/online.ts`, from APP-2.

## Log

| Date | Event |
|---|---|
| 2026-11-11 | Written by sprint 1's close: `open`. |
| 2026-11-12 | Done already: the queued lookup, from BOK-3, and the online status, from APP-2, in place of the two items they completed (sprint 2) |
