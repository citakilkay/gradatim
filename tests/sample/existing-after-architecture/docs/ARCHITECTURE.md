# Shelf · The architecture

*The architecture step's architecture, written on 2026-11-17, from [its records](decisions/architecture.md). It rests on D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11, D12, D13, D14, D15 and D16 ([the decisions](decisions/README.md)).*

## Overview

Shelf is one Node.js process on one machine the reader runs (D12). It serves one page as HTML rendered on the server, where every action is a plain form (D13), on Node's own `node:http` with no framework and no dependency (D10). The rules on shelves and books are plain functions over the data, apart from HTTP (D14), and the data is one JSON file on disk, written whole after each change (D11). There is one reader and no sign-in (D1), and the app works online only (D2).

## Modules

| Code | Module | What it holds | Stories |
|---|---|---|---|
| SRV | Server | `src/shelf.js`: reads `PORT` and `SHELF_DATA_DIR`, loads the store, starts the HTTP server; the service manager's unit and the data folder on the host (D10, D12) | |
| STO | Store | `src/store.js`: loads the data file at start, creates it with the three first shelves when it is missing, and writes it atomically after each change (D2, D7, D11) | M1 |
| SHF | Shelves | `src/shelves.js`: the first shelves, adding, renaming, deleting and ordering shelves, unique names, the refusal to delete a shelf with books, and the finished mark (D3, D7, D8) | M3, M5, M7, P1.3 |
| BOK | Books | `src/books.js`: adding a book by title onto the first shelf, the check of a title, moving a book with its finished date, removing a book, and the count of books finished this year (D5, D6, D9) | M4, M6, M8, M9, P1.1 |
| WEB | Web | `src/web.js` and `src/page.js`: the routes, parsing and checking a post, the redirect or the message, the page's HTML, and the JSON of `/books` (D5, D13) | M2, P1.2 |

## Seams

- **SRV → WEB:** the server calls `createHandler(store)` and passes its result to `createServer`. Nothing else in SRV knows a route.
- **WEB → SHF and BOK:** each route parses its post, then calls one function such as `addBook(data, title, today)` or `deleteShelf(data, shelfId)`. Each returns `{ ok: true }` or `{ ok: false, error }`, with a message for the reader, and throws nothing for a refusal. Today's date is passed in, so the count and the finished date are tested without a clock.
- **WEB → STO:** after a function returns `ok`, the route calls `store.save()`, and only then redirects. A refused action saves nothing.
- **SHF and BOK → data:** both work on the one object the store loaded, and neither reads or writes the disk.
- **The routes** (D13): `GET /` the page; `GET /books` the books as JSON; `POST /books` adds a book, by form or by JSON, `201` for JSON; `POST /books/{id}/move`, with `shelf`; `POST /books/{id}/remove`; `POST /shelves`, with `name`; `POST /shelves/{id}/rename`, with `name`; `POST /shelves/{id}/delete`; `POST /shelves/{id}/finished`. A form post that works is answered `303` to `/`; a refused one gets the page again with its message and `400`; a refused JSON post gets `400` with `{ "error": "…" }`. A body that isn't valid, or is larger than 64 KB, is refused and never reaches a rule (D5).
- **Outside services:** none. Adding by ISBN is open (D16).

## Data

STO owns the file `shelf.json` in the folder `SHELF_DATA_DIR` names, in this shape:

```json
{
  "version": 1,
  "shelves": [
    { "id": "…", "name": "Reading", "finished": false },
    { "id": "…", "name": "To read", "finished": false },
    { "id": "…", "name": "Finished", "finished": true }
  ],
  "books": [
    { "id": "…", "title": "…", "shelfId": "…", "finishedOn": "2026-11-17" }
  ]
}
```

- Ids come from `crypto.randomUUID()`. The order of `shelves` is the shelves' order, and the first is where a new book lands (D7).
- At most one shelf has `finished: true`, and none does after an empty finished shelf is deleted (D3, D8).
- `finishedOn` is the day a book was moved onto the finished shelf, as `YYYY-MM-DD` in the server's local time, and `null` elsewhere (D6). The count is the books on the finished shelf whose `finishedOn` falls in the current calendar year.
- `version` lets a later release change the shape, with the store moving an older file up on load.
- A missing file is a new Shelf: the store writes the three first shelves (D7). A file that isn't valid stops the start with a message, and is never written over.

## Deployment

Shelf runs on one machine the reader runs, a home server or a small VPS, as `npm start` under systemd, which restarts it when it stops (D12). The checkout holds a tagged release; the data folder sits outside it, named by `SHELF_DATA_DIR`, and `PORT` names the port, 3000 when unset. Node 22 LTS or later is installed there (D10). Reaching it from outside the machine, and HTTPS, are the host's own, such as a reverse proxy, and outside Shelf's code. [The runbook](RUNBOOK.md) says how a release goes out.

## Testing

- **Unit:** SHF's and BOK's functions on plain data, with a test for each rule of D3, D5, D6, D7, D8 and D9, and today's date passed in.
- **Store:** STO against a temporary folder: a new file with three shelves, a save and a reload, and a file that isn't valid left alone.
- **HTTP:** WEB through a server started on a free port with a temporary data folder: each route's redirect, refusal and message, the JSON of `/books`, and a bad JSON body that leaves the server running.
- **The gate:** `npm test` passes before each commit on `main` (D15). All tests use `node --test` and `node:assert`, with no dependency.

## Open choices

| Choice | Decided by | Until then | Record |
|---|---|---|---|
| The book API for adding by ISBN, and how the server calls it | Phase 1, with P1.1 | Shelf calls no outside service, and a book is its title | D16 |

## Change log

| Date | Change |
|---|---|
| 2026-11-17 | Written by the architecture step |
