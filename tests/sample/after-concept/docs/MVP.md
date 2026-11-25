# Shelf · The MVP

*The concept step's MVP, written on 2026-11-06. It rests on D1, D2, D3, D4, D5, D6 and D7 ([the decisions](decisions/README.md)). A story keeps its id, also when it moves.*

The MVP is Shelf on one device, offline: a reader adds books by ISBN, Shelf fills in their details and covers, and the reader keeps them on shelves they name. It shows whether adding by ISBN and keeping shelves offline works for a reader, before the account and sync are built.

**Done when** a reader, with the network off, can add a book by its ISBN, see its title, author and cover filled in once they are back online, and move it between their own shelves.

**Out, and why:**
- The count of books finished this year: [phase 1](PHASE-1.md), since the user chose to ship the MVP without it. The MVP still records and edits the finished dates the count will use.
- An account, and syncing shelves across devices: [phase 1](PHASE-1.md), since a reader can try Shelf on one device first. Until then, clearing the browser loses the shelves.

### M1 · Offline app shell

Status: `planned` · Estimate: 1 dev-days · Depends on: — · Decisions: D3

Shelf installs as a web app, and opens and runs with no network. Done when a reader opens Shelf with the network off, after a first visit, and it loads.

### M2 · Shelves the reader names

Status: `planned` · Estimate: 1.5 dev-days · Depends on: M1 · Decisions: D5

A new reader starts with Reading, To read and Finished, can rename any of them, and can add and delete shelves of their own. Finished stays marked as the finished shelf when renamed. Done when a reader renames To read, adds a shelf, and sees both after reopening Shelf offline.

### M3 · Add a book by its ISBN

Status: `planned` · Estimate: 1 dev-days · Depends on: M2 · Decisions: D4, D5

A reader types an ISBN and picks a shelf, and the book is saved at once, online or offline. Done when a book added with the network off shows on its shelf by its ISBN.

### M4 · Title and author from Open Library

Status: `planned` · Estimate: 2 dev-days · Depends on: M3 · Decisions: D1, D2, D4

Shelf fills in a book's title and author from Open Library's ISBN API and Authors API, within its request limits, and retries when the device is back online or Open Library is back up. Done when a book added offline shows its title and author once the network is back.

### M5 · Type the title and author by hand

Status: `planned` · Estimate: 0.5 dev-days · Depends on: M4 · Decisions: D4

When Open Library has no record of the ISBN, the reader types the title and author. Done when a book whose ISBN Open Library doesn't know shows the title and author the reader typed.

### M6 · Covers stored on the device

Status: `planned` · Estimate: 1 dev-days · Depends on: M4 · Decisions: D2, D6

Shelf fetches each book's cover by its cover ID and stores the image on the device, with a placeholder when there is no cover. Done when a book's cover shows with the network off.

### M7 · Move or remove a book

Status: `planned` · Estimate: 1 dev-days · Depends on: M3 · Decisions: D5, D7

A reader moves a book to another shelf, or removes it. Moving it onto Finished records today's date, and moving it off clears that date. Done when a book moved onto Finished shows the date it was finished.

### M8 · Edit the finished date

Status: `planned` · Estimate: 0.5 dev-days · Depends on: M7 · Decisions: D7

A reader changes a finished book's date, such as for a book finished before they used Shelf. Done when a book shows the date the reader set.

### M9 · Ask Open Library about stored covers

Status: `planned` · Estimate: 0.25 dev-days · Depends on: M6 · Decisions: D6

Before release, Shelf asks openlibrary@archive.org whether an app may store covers on the device. If they say no, Shelf stores only the cover URL and shows a placeholder offline. Done when Open Library's answer is recorded and Shelf follows it.

## Change log

| Date | Change |
|---|---|
| 2026-11-06 | Written by the concept step: M1 to M9 |
