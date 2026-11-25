# BOK-3 · Add a book by its ISBN

Parent: [sprint 2](README.md)

| | |
|---|---|
| Status | `completed` |
| Story | M3 |
| Depends on | SHF-3 |
| Takes | `2026-11-11-BOK-1-add-by-isbn.md` |
| Design | [the design](../../plans/BOK-3-add-by-isbn-design.md) |

## Goal

A reader types an ISBN and picks a shelf, and the book is saved at once, with a lookup queued, and shows on its shelf by its ISBN (M3, D4, D5).

## Scope

**In**
- All that the deferred item carries, since BOK-1's build had not started.
- `books.ts`: add a book and its lookup entry in one transaction, and remove a book.
- The add-book view, with ISBN checking for ISBN-10 and ISBN-13, and a shelf to pick.
- A shelf's books shown by their ISBN until their details arrive.

**Out**
- Draining the lookup queue: M4, which `2026-11-11-LKP-1-open-library-lookup.md` carries.
- Moving a book: M7, for a later sprint.

## Acceptance criteria

- [x] A book added by its ISBN is saved at once, and shows on its shelf by its ISBN. **Shown 2026-11-12:** `e2e/add-book.test.ts` adds `978-0-14-044913-6` to To read and finds `ISBN 9780140449136` on that shelf, at a desktop's and a phone's width; `src/routes/add/page.test.ts` finds the book stored on the shelf it picked.
- [x] The book and its queue entry are written together, or neither is. **Shown 2026-11-12:** `src/lib/books.test.ts` finds the book and its entry after an add, and neither when the entry's write fails.
- [x] *New, by the design of 2026-11-12:* A wrong ISBN is refused, and nothing is saved. **Shown 2026-11-12:** `src/lib/isbn.test.ts` refuses a wrong check digit, a wrong length and letters; `books.test.ts` saves nothing for a wrong ISBN; `add/page.test.ts` says why, and stays on the page.

## Questions for the brainstorm

1. **Is an ISBN-10 stored as typed or converted to ISBN-13?** Open Library takes both. Proposed: stored as ISBN-13, with hyphens and spaces taken out.
2. **What if the same ISBN is added twice?** Proposed: Shelf says it's already on a shelf, and doesn't add it again.

## Documents to check on close

- [The MVP](../../MVP.md): M3's status.

## Log

| Date | Event |
|---|---|
| 2026-11-11 | Written by the new sprint step. |
| 2026-11-12 | Designed by the design task step: [the design](../../plans/BOK-3-add-by-isbn-design.md). An ISBN-10 kept as its ISBN-13, and no second copy of a book; one criterion added; days unchanged. |
| 2026-11-12 | Build started by the build task step, on `main`, with no branch of its own. |
| 2026-11-12 | Step 1: `src/lib/isbn.ts` takes out hyphens and spaces, checks an ISBN-10's and an ISBN-13's check digit, and turns an ISBN-10 into its ISBN-13, shown by `npm test` (`isbn.test.ts` failed first on the missing module, then 6 passed). |
| 2026-11-12 | Step 2: `src/lib/books.ts` adds a book, `pending`, and its lookup entry in one transaction, refuses a wrong ISBN and a book already on a shelf, lists a shelf's books in the order added, and removes a book softly with its entry, shown by `npm test` (`books.test.ts`, 7 passed). Two books added in one millisecond have no order, so the test of the list sets the clock between its adds, with only `Date` faked, since the in-memory IndexedDB runs on timers. |
| 2026-11-12 | Step 3: `/add`, in `src/routes/add/+page.svelte`, asks for the ISBN and the shelf, saves through `books.ts` and goes back to `/`, or says why it refused; the home page shows each shelf's books by their ISBN, and links to `/add`. Shown by `npm test` (43 passed), `npm run test:e2e` (`add-book.test.ts` failed first on no link to `/add`, then 12 passed), `npm run check` (0 errors) and `npm run build`. |
| 2026-11-12 | What shows each criterion, for the close: 1. `e2e/add-book.test.ts` adds `978-0-14-044913-6` to To read and finds `ISBN 9780140449136` on that shelf, at a desktop's and a phone's width; `src/routes/add/page.test.ts` finds the book stored on the shelf picked · 2. `books.test.ts` finds the book and its entry after an add, and neither when the entry's write fails · 3. `isbn.test.ts` refuses a wrong check digit, a wrong length and letters; `books.test.ts` saves nothing for a wrong ISBN; `add/page.test.ts` says why, and stays on the page |
| 2026-11-12 | Built by the build task step, on `main`, with no branch of its own. The close is next. |
| 2026-11-12 | Closed by the close task step: `completed`, every criterion shown. Review: L1 applied, a removed book can be added again, since the check for a book already on a shelf skips removed books, with its test; M1 left at the user's word: the home page reads the books through a Dexie live query of its own on the store's `db`, past `books.ts`, and the user keeps it while that page is the only reader of the books. Documents: none. |
