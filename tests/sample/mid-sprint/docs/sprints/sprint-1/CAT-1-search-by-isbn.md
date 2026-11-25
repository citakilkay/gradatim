# CAT-1 · Search by ISBN

Parent: [sprint 1](README.md)

| | |
|---|---|
| Status | `completed-as-partial` |
| Story | M1 |
| Depends on | — |
| Takes | — |
| Design | [the design](../../plans/CAT-1-search-by-isbn-design.md) |

## Goal

A reader types an ISBN, and Shelf shows the book's title, author and cover from Open Library (D2, D3).

## Acceptance criteria

- [x] An ISBN-10 or an ISBN-13 returns the title, the authors and a cover. **Shown 2026-11-05:** the lookup's tests, and the reader's check on the add-a-book page.
- [x] A book looked up is kept on the device, so that it shows offline (D4). **Shown 2026-11-05:** the test that reads it back from IndexedDB with the network off.
- [ ] A batch of twenty lookups stays within Open Library's limit. **Moved to CAT-3** at the user's word, since it needs a queue, as `2026-11-04-CAT-1-rate-limits.md` says.

## Documents to check on close

- The architecture: the lookup's interface.
- The commands: a command to try a lookup.

## Log

| Date | Event |
|---|---|
| 2026-11-04 | Written by the new sprint step. |
| 2026-11-04 | Design written. |
| 2026-11-04 | Build started: `in-progress`. A problem that needs thought: `2026-11-04-CAT-1-rate-limits.md`. |
| 2026-11-05 | Closed as `completed-as-partial`: two of three criteria, and the third moved to CAT-3. The sync recorded the lookup's interface in the architecture, and `npm run lookup` in the commands. |
