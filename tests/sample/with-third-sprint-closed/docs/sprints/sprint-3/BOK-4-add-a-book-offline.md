# BOK-4 · Add a book with the network off

Parent: [sprint 3](README.md)

| | |
|---|---|
| Status | `completed` |
| Story | M10 |
| Depends on | — |
| Takes | — |

## Goal

The Add button on `/add` stays on with the network off, so a book is saved on the device either way, as M3 promised and adding a book never blocks (M10, D4).

## Scope

**In**
- The Add button, which no longer waits for the network: the book and its lookup entry go in the device store at once, as BOK-3 saves them.

**Out**
- The lookup that fills the title and author once back online: LKP-1's deferred item.

## Acceptance criteria

- [x] A book added with the network off, after a first visit, shows on its shelf by its ISBN, at a phone's width and a desktop's: a Playwright test. **Shown 2026-11-14:** `e2e/add-book-offline.test.ts` opens Shelf, waits for the service worker, turns the network off, adds a book from `/add`, and finds it on its shelf by its ISBN, at both widths.
- [x] The Add button is on with the network off. **Shown 2026-11-14:** `src/routes/add/page.test.ts` sets the browser offline, adds a book, and finds it saved.

## Questions for the brainstorm

1. **Does the button say that the book is saved offline?** Proposed: no: the shelf shows the book by its ISBN, as it does online, until the lookup fills it in.

## Documents to check on close

- [The MVP](../../MVP.md): M10's status.

## Log

| Date | Event |
|---|---|
| 2026-11-14 | Written by the new sprint step. |
| 2026-11-14 | Build started by the build task step, on `main`, with no branch of its own. |
| 2026-11-14 | The Add button in `src/routes/add/+page.svelte` no longer reads the online status, which the lookup still watches. Shown by `npm test` (`page.test.ts`'s offline test failed first, with the button off, then passed), `npm run check` (0 errors), `npm run build`, and `npm run test:e2e` (`add-book-offline.test.ts` failed first, then 14 passed). |
| 2026-11-14 | What shows each criterion, for the close: 1. `e2e/add-book-offline.test.ts` adds a book with the network off after a first visit, at both widths · 2. `src/routes/add/page.test.ts` adds a book with the browser offline |
| 2026-11-14 | Built by the build task step, on `main`, with no branch of its own. The close is next. |
| 2026-11-14 | Closed by the close task step: `completed`, every criterion shown. Review: no finding. Documents: none made stale. |
