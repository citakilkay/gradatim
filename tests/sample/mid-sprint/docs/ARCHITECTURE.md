# Shelf · The architecture

*Written by the architecture step on 2026-11-04, from [its records](decisions/architecture.md), D7 to D9.*

## Overview

A static front end in the browser keeps the reader's books and shelves in IndexedDB (D7). A small Node server holds each reader's shelves in SQLite, sends the sign-in links, and takes the changes made offline (D8). Pages are served as UTF-8, and dates are stored as ISO-8601 strings.

## Modules

| Code | Module | What it holds |
|---|---|---|
| CAT | The catalogue | The ISBN lookup through Open Library's Books API, and the covers by link (D2, D3) |
| SHF | The shelves | The reader's books and shelves, moving books, and the count of the year (D6) |
| SYN | The sync | The offline store and the catch-up with the server (D4) |
| INF | Infrastructure | The server, sign-in by an e-mail link, and hosting (D5, D8, D9) |

## The offline store

The front end writes every change to IndexedDB first. Changes made offline wait in a queue, and the SYN module sends them to the server's `POST /sync` once the reader is back online. The last write wins.

## The lookup

`lookup(isbn)` asks Open Library's Books API with `jscmd=data`, and returns the title, the authors and the cover IDs. Open Library limits lookups by ISBN to 100 per IP every 5 minutes, which CAT-3 handles.

## Deployment

One small virtual machine runs the server behind Caddy, which also serves the front end (D9). [The runbook](RUNBOOK.md) says how a release goes out.

## Change log

| Date | Change |
|---|---|
| 2026-11-04 | Written by the architecture step |
| 2026-11-05 | The lookup's interface (CAT-1's close) |
