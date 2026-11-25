# Shelf · The MVP

*The concept step's MVP, written on 2026-11-17. It rests on D2, D3, D5, D6, D7, D8 and D9 ([the decisions](decisions/README.md)). A story keeps its id, also when it moves.*

The MVP is the whole idea: books are saved, they sit on shelves the reader names, a reader moves them, and the page counts the books finished this year. It also keeps what D3, D8 and D9 promise, so that no decision is only half met. This shows whether a reader keeps using Shelf to follow their reading.

**Done when** a reader adds a book, moves it from To read to Reading and then to Finished, sees this year's count go up by one, and finds it all still there after the server restarts.

**Out, and why:**
- Adding a book by ISBN from a book API: [phase 1](PHASE-1.md), since D4 decides it after the MVP's release.
- Books grouped by shelf, and reordering shelves: [phase 1](PHASE-1.md), since they are the concept step's proposals and no decision asks for them.

### M1 · Books and shelves saved on the server

Status: `planned` · Estimate: 1 dev-days · Depends on: — · Decisions: D2

A reader's books and shelves are saved on the server, so they survive a restart. Done when a book added before a restart is on the page after it.

### M2 · See all books on one page

Status: `existing` · Estimate: — · Depends on: — · Decisions: none, from the idea

A reader sees all their books on one page, each with its shelf, and the same list comes back as JSON from `/books`. Done when every book added shows on the page with its shelf.

Exists: 01 F2.

### M3 · A new Shelf starts with three shelves

Status: `planned` · Estimate: 0.5 dev-days · Depends on: M1 · Decisions: D7

A new Shelf starts with Reading, To read and Finished, in that order, and Finished is marked as the finished shelf. Done when a fresh Shelf shows these three shelves in order, with Finished marked.

### M4 · Add a book by its title

Status: `planned` · Estimate: 0.5 dev-days · Depends on: M1, M3 · Decisions: D5, D7

A reader adds a book by typing its title, and it goes on the first shelf in order. A post that isn't valid, or has no title or a blank one, is refused with an error and adds no book. Done when a new book lands on the first shelf, and a bad or blank post returns an error and leaves the list as it was.

Exists in part: 01 F1: the form adds a book by its title; 01 F10: the post isn't checked, and every book goes on "To read".

### M5 · Add, rename and delete shelves

Status: `planned` · Estimate: 1.5 dev-days · Depends on: M3 · Decisions: D3, D7, D8

A reader adds, renames and deletes shelves, and no shelf is fixed. A name that another shelf already has is refused, and so is deleting a shelf that holds books, the finished shelf included. Done when a reader can make, rename and delete an empty shelf, and a duplicate name or the delete of a shelf with books is refused with a message.

### M6 · Move a book from one shelf to another

Status: `planned` · Estimate: 0.75 dev-days · Depends on: M3 · Decisions: D3

A reader moves a book from its shelf to any other shelf. Done when the book shows on its new shelf, also after a restart.

### M7 · Mark a shelf as the finished shelf

Status: `planned` · Estimate: 0.5 dev-days · Depends on: M5 · Decisions: D3, D8

A reader marks one shelf as the shelf of finished books, and only one shelf is marked at a time. If the reader deletes an empty finished shelf, no shelf is marked until they mark another. Done when marking a shelf moves the mark to it, and after an empty finished shelf is deleted, no shelf shows as marked.

### M8 · Count of books finished this year

Status: `planned` · Estimate: 0.75 dev-days · Depends on: M6, M7 · Decisions: D6

When a book is moved onto the finished shelf, Shelf saves that day as its finished date. A book moved off loses its date, and gets a new one if it comes back. The page shows how many books on the finished shelf have a date in the current calendar year, and shows nothing while no shelf is marked. Done when moving a book onto the finished shelf raises the count by one, and moving it off lowers it by one.

### M9 · Remove a book

Status: `planned` · Estimate: 0.25 dev-days · Depends on: M1 · Decisions: D9

A reader removes a book they added by mistake. Done when a removed book is gone from the page, also after a restart.

## Change log

| Date | Change |
|---|---|
| 2026-11-17 | Written by the concept step: M1 to M9 |
