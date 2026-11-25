# Shelf · Phase 1

*The concept step's phase 1, written on 2026-11-17. It rests on D4 ([the decisions](decisions/README.md)).*

Phase 1 saves the reader typing and makes the page easier to read. It starts once the MVP is released, which is also when D4's time comes, and ends when a reader can add a book by its ISBN and sees their books grouped under shelves in an order they set.

### P1.1 · Add a book by ISBN from a book API

Status: `planned` · Estimate: 2 dev-days · Depends on: M4 · Decisions: D4

A reader types a book's ISBN, and Shelf fills in its title from a free book API. Until D4 is decided after the MVP's release, this story assumes research on a book API comes first. Done when typing an ISBN adds the book with its title.

### P1.2 · Books grouped by shelf

Status: `planned` · Estimate: 0.5 dev-days · Depends on: M3 · Decisions: none, proposed

The page lists books under their shelf, in shelf order, instead of one list where each book names its shelf. Done when each shelf shows as a heading with its books under it, and an empty shelf shows as empty.

### P1.3 · Reorder shelves

Status: `planned` · Estimate: 0.75 dev-days · Depends on: M5 · Decisions: none, proposed

A reader changes the order of their shelves, which also changes the shelf a new book lands on (D7). Done when a reader moves a shelf up or down and the new order holds after a restart.

## Change log

| Date | Change |
|---|---|
| 2026-11-17 | Written by the concept step: P1.1 to P1.3 |
