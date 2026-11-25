# Shelf · The architecture

*The architecture step's architecture, written on 2026-11-18, from [its records](decisions/architecture.md). It rests on D3, D4, D5 and D6 ([the decisions](decisions/README.md)).*

## Overview

One Node process serves everything (D3): `src/shelf.js` answers the page at `/`, adds a book on `POST /books`, and lists the books as JSON on `GET /books`. The books live in memory until M4 keeps them (D4). It runs on the reader's machine with `npm start` (D6).

## Modules

| Code | Module | What it holds | Stories |
|---|---|---|---|
| SRV | The server | The http server, its port and its routes (D3) | |
| BOK | The books | Adding a book, the page's list, the JSON at `/books`, and the year's count (D3) | M1, M2, M5 |
| SHF | The shelves | The shelves the reader names, and moving a book between them | M3 |
| STO | The storage | Where the books and the shelves are kept (D4) | M4 |

## Seams

The server hands each request to the books' and the shelves' code in `src/shelf.js`. The page posts a form to `POST /books`; a script reads `GET /books`, as `[{ "title": …, "shelf": … }]`. Nothing crosses to a service outside.

## Data

A list of books, each `{ title, shelf }`, owned by BOK, in memory (D4). SHF adds the list of shelves; M5 needs the date a book moved to Finished. STO owns how both are kept once M4 is built.

## Deployment

Shelf runs on the reader's own machine with `npm start`, at http://localhost:3000 (D6). [The runbook](RUNBOOK.md) says how a release goes out.

## Testing

Unit and route tests with `node --test` (D5); there are none yet. The gate before a merge: `npm test` passes.

## Open choices

| Choice | Decided by | Until then | Record |
|---|---|---|---|
| Where the books are kept | M4 | In memory, lost at a restart | D4 |
| Where Shelf is hosted | The MVP | The reader's own machine, port 3000 | D6 |

## Change log

| Date | Change |
|---|---|
| 2026-11-18 | Written by the architecture step, through init's quick start, from the code |
