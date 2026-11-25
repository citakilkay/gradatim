# Shelf · The MVP

*The concept step's MVP, written on 2026-11-18. It rests on the idea alone. A story keeps its id, also when it moves.*

The MVP is the milestone under way in the project's own sprint 2: shelves the reader names, the books kept on disk, and the year's count. With it, a reader can keep their books on Shelf for good, which shows whether the idea works.

**Done when** a reader adds a book, moves it to a shelf they named, finds it there after a restart, and sees the year's count of finished books.

**Out, and why:**
- Adding a book by its ISBN, and shelves that work offline with a sync, from the project's `docs/notes.md`: they wait for a later plan, since the MVP needs neither.

### M1 · Add a book and see every book with its shelf

Status: `existing` · Estimate: — · Depends on: — · Decisions: none, the user's word

A reader adds a book by its title, and sees every book on one page with its shelf. Done when a book added from the form shows on the page, on "To read".

Exists: 01 F1.

### M2 · The books as JSON

Status: `existing` · Estimate: — · Depends on: M1 · Decisions: none, the user's word

A script or another app reads every book, with its shelf, as JSON at `GET /books`. Done when `GET /books` answers with the list, `[{ "title": …, "shelf": … }]`.

Exists: 01 F2.

### M3 · Shelves the reader names

Status: `planned` · Estimate: 1.5 dev-days · Depends on: M1 · Decisions: none, the user's word

A reader makes their own shelves, such as Reading and Finished, and moves a book between them. Done when a reader adds a shelf by its name, moves a book to it, and the page shows each book on its shelf.

### M4 · Keep the books in a file

Status: `planned` · Estimate: 1 dev-days · Depends on: M3 · Decisions: none, the user's word

The books, with their shelves, are kept in one file beside the app, so a restart loses nothing. Done when a book added before a restart is still on its shelf after it.

### M5 · The count of books finished this year

Status: `planned` · Estimate: 1 dev-days · Depends on: M3 · Decisions: none, the user's word

A reader sees how many books they finished this year, at the top of the page; a book counts once it moves to Finished, on the date it moved. Done when the page shows "Finished this year: n", and a book moved to Finished adds one.

## Change log

| Date | Change |
|---|---|
| 2026-11-18 | Written by the concept step, through init's quick start: M1 to M5 |
