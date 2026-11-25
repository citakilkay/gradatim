# BOK-3 · Add a book by its ISBN: design

*The design of task [BOK-3](../sprints/sprint-2/BOK-3-add-by-isbn.md), for M3. Written by the design task step on 2026-11-12.*

## The idea

- `books.ts` writes the book, `pending`, and its entry in the lookup queue in one transaction, so that both are saved or neither is, and the book is on its shelf at once (D4).
- An ISBN is checked as an ISBN-10 or an ISBN-13 by its check digit, with hyphens and spaces taken out, and kept as its ISBN-13 (decision 1).
- A book whose ISBN is already on a shelf isn't added again, and Shelf names the shelf that holds it (decision 2).
- Each book shows on its shelf by its ISBN, until the lookup fills in its title and author (D4).
- The add page asks for the ISBN and a shelf, with the first shelf picked until the reader picks another, and goes back to the shelves once the book is saved (chosen for the user).
- Removing a book is a soft delete of the book and its queue entry, in `books.ts`, ready for M7's view (chosen for the user).
- All that `2026-11-11-BOK-1-add-by-isbn.md` carries is built here, since BOK-1's build had not started (D4).

## The user's decisions

1. **An ISBN-10 is kept as its ISBN-13, with hyphens and spaces taken out.** *Over:* keeping each ISBN as typed, which shows one book two ways, and has the lookup ask for it under two keys.
2. **A book already on a shelf isn't added again: Shelf says which shelf holds it.** *Over:* adding a second copy, which puts one book on two shelves, as D5 rules out; and moving it to the shelf picked without a word.

## Steps

### 1. The ISBN check

- `isbn.ts` takes out hyphens and spaces, checks an ISBN-10's check digit, X included, and an ISBN-13's, and gives an ISBN-10's ISBN-13 (decision 1).
- It refuses a wrong check digit, a wrong length, and letters.

**Done when:** unit tests accept ISBN-10s and ISBN-13s as readers type them, with hyphens and spaces, and refuse the three kinds of wrong ISBN.

### 2. A book and its lookup, in one transaction

- `books.ts` adds the book on the shelf picked, with `lookup` set to `pending`, and its entry in the lookup queue, in one transaction; a wrong ISBN, or one already on a shelf, writes nothing (decision 2).
- It lists a shelf's books in the order they were added, and removes a book softly, with its queue entry.

**Done when:** unit tests show the book and its entry saved together, neither saved when the entry's write fails, both refusals, the list and the removal.

### 3. The add page, and the books on their shelves

- `/add` has the ISBN field, the list of shelves and the Add button; it saves through `books.ts` and goes back to `/`, or says why it refused, and stays.
- The home page links to `/add`, and shows each shelf's books by their ISBN.

**Done when:** component tests add a book to the shelf picked and refuse a wrong ISBN, and a Playwright test adds a book by its ISBN and finds it on its shelf, at a desktop's and a phone's width.

## Acceptance criteria

| # | Criterion | Step | Shown by |
|---|---|---|---|
| 1 | A book added by its ISBN is saved at once, and shows on its shelf by its ISBN. | 2, 3 | The Playwright test of the add, at both widths, and the component test of `/add` |
| 2 | The book and its queue entry are written together, or neither is. | 2 | The unit test in which the entry's write fails |
| 3 | A wrong ISBN is refused, and nothing is saved. | 1, 2, 3 | The unit tests of `isbn.ts` and `books.ts`, and the component test of `/add` |

## The estimate

1 dev-day: unchanged. M3's figure.

## Documents

**With this design:** the Design row in BOK-3's header, criterion 3 added to its criteria as new, and a log row in BOK-3 and in the sprint's README. The days don't move.

**At the close:** none expected, since the architecture's Data has the books' and the lookups' fields as they are built. M3's status is close sprint's.

## Watch for

- The book and its entry share one transaction: two writes outside one would leave a book that nothing looks up when the second fails.
- An ISBN-10's ISBN-13 takes the prefix 978 and a check digit of its own: the ISBN-10's isn't kept.
- `/add` is prerendered like `/`, so the service worker caches it with the shell.

## Change log

| Date | Change |
|---|---|
| 2026-11-12 | Written by the design task step. |
