# Shelf · The main concept

*The concept step's main concept, written on 2026-11-06. It rests on D1, D2, D3, D4, D5, D6, D7, D8 and D9 ([the decisions](decisions/README.md)).*

## The idea

Shelf, a small web app where a reader keeps track of their books. A reader adds a book by its ISBN, and Shelf fills in the title, the author and the cover from a public book API. Books sit on shelves the reader names, such as Reading, To read and Finished. The shelves work offline, and catch up when the reader is back online. A reader can see how many books they finished this year.

## What Shelf is

Shelf is for a reader who wants a simple, private list of their books, sorted onto shelves they name. They type an ISBN and Shelf fills in the rest, so keeping the list takes seconds. It works without a network, and once the reader has an account, their shelves follow them from device to device.

- **Books come from Open Library:** a reader types an ISBN, and Shelf looks up the title and author with Open Library's ISBN API and Authors API, with no key and no second source (D1, D2).
- **Adding never blocks:** a book is saved the moment its ISBN is entered. The details fill in once a lookup succeeds, and the reader types them when Open Library has no record (D4).
- **Shelves are the reader's:** every reader starts with Reading, To read and Finished, can rename them and add their own, and each book sits on one shelf (D5).
- **Offline first:** shelves and covers live on the device, so Shelf works with no network (D3, D6).
- **Finished dates count:** moving a book onto Finished records the date, which the reader can edit, and the count of books finished this year uses it (D5, D7).
- **One account, many devices:** a reader signs in, and their shelves sync with the server whenever the device is online. When two devices change the same book, the later change wins (D3, D9).

## What Shelf is not

- Not a paid product: Shelf is free and non-commercial, which keeps it within Open Library's terms (D8).
- Not a second book source: there is no Google Books or other fallback (D1).
- Not multi-shelf tagging: a book sits on exactly one shelf, not on several at once (D5).
- Not a conflict screen: sync doesn't ask the reader which change to keep (D9).
- Not storing covers against Open Library's word: if they say no, Shelf keeps only the cover's URL and shows a placeholder offline (D6).

## The plan

[The MVP](MVP.md) holds the first usable version, [the roadmap](ROADMAP.md) its milestones, and [phase 1](PHASE-1.md) and [phase 2](PHASE-2.md) what comes after it. The overview, `docs/artifacts/01-overview.html`, shows them on one page.

## Change log

| Date | Change |
|---|---|
| 2026-11-06 | Written by the concept step, with the idea moved in from `AGENTS.md` |
