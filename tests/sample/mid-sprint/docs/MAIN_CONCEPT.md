# Shelf · The main concept

*The concept step's document, written on 2026-11-04 from [the decisions](decisions/README.md).*

## The idea

Shelf, a small web app where a reader keeps track of their books. A reader adds a book by its ISBN, and Shelf fills in the title, the author and the cover from a public book API. Books sit on shelves the reader names, such as Reading, To read and Finished. The shelves work offline, and catch up when the reader is back online. A reader can see how many books they finished this year.

## What Shelf is

- **For one reader at a time,** in the browser, on a phone or a computer (D1).
- **A book comes from its ISBN:** Open Library gives its title, its author and its cover (D2). Covers are shown by link, never stored (D3).
- **Shelves the reader names,** with books moved between them.
- **Offline first:** the shelves are kept on the device, work offline, and catch up when the reader is back online (D4).
- **Signed in by an e-mail link,** so the shelves survive a new phone (D5).
- **Finished this year:** the count of books moved to Finished since 1 January (D6).

## What Shelf is not

A shop, a social network, or a reading tracker with goals. A yearly goal waits for [phase 1](PHASE-1.md).

## The plan

[The MVP](MVP.md) holds the first release's stories, [the roadmap](ROADMAP.md) their order, and [phase 1](PHASE-1.md) what comes after.

## Change log

| Date | Change |
|---|---|
| 2026-11-04 | Written by the concept step, with the idea moved in from `AGENTS.md` |
