# Shelf · The main concept

*The concept step's main concept, written on 2026-11-17. It rests on D1, D2, D3, D4, D5, D6, D7, D8 and D9 ([the decisions](decisions/README.md)).*

## The idea

Shelf, a small web app where a reader keeps track of their books. A reader adds a book by its title and sees all their books on one page. Books sit on shelves the reader names, such as Reading, To read and Finished, and a reader moves a book from one shelf to another. A reader can see how many books they finished this year.

## What Shelf is

Shelf is for one reader who wants to see, on one page, what they are reading, what they want to read and what they have finished. They add a book by its title, keep it on a shelf they name, and move it as their reading goes on. The page also shows how many books they finished this year.

- **Saved for good:** the books and shelves are kept on the server, so nothing is lost when it restarts (D2).
- **Shelves the reader names:** a new Shelf starts with Reading, To read and Finished, and the reader can add, rename and delete shelves. Two shelves can't share a name, and a new book lands on the first shelf (D3, D7).
- **No book lost by mistake:** a shelf that holds books can't be deleted, and a bad or blank book post adds nothing (D8, D5).
- **A count that matches the shelf:** a book gets its finished date when it is moved onto the finished shelf, and loses it when it is moved off. The count covers the current calendar year (D3, D6).
- **A book is its title:** a book has a title, a shelf and, on the finished shelf, a date, and the reader can remove one (D9).

## What Shelf is not

- Not for several readers: it has no accounts, no sign-in and no per-person data (D1).
- Not offline: it works online only, with no copy in the browser and no sync (D2).
- Not a catalogue: it has no authors and no covers, and it calls no book API. Adding a book by ISBN is decided after the MVP's release (D4, D9).

## The plan

[The MVP](MVP.md) holds the first usable version, [the roadmap](ROADMAP.md) its milestones, and [phase 1](PHASE-1.md) what comes after it. The overview, `docs/artifacts/01-overview.html`, shows them on one page.

## Change log

| Date | Change |
|---|---|
| 2026-11-17 | Written by the concept step, with the idea moved in from `AGENTS.md` |
