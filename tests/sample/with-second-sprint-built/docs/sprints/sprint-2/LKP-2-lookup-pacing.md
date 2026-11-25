# LKP-2 · Pace the lookups, back off on 429, and show a waiting lookup

Parent: [sprint 2](README.md)

| | |
|---|---|
| Status | `completed` |
| Story | M4 |
| Depends on | — |
| Takes | `2026-11-10-LKP-1-open-library-rate-limit.md` |
| Design | [the design](../../plans/LKP-2-lookup-pacing-design.md) |

## Goal

A reader who adds a pile of books gets every title and author filled in, as the lookups go out at most one a second and back off on HTTP 429, and the reader sees which lookups are waiting (M4, D1, D2).

## Scope

**In**
- Spacing the queue's requests to at most one a second, as the architecture's seam to Open Library says.
- Backing off on a 429, honouring `Retry-After` when it is sent.
- A mark on a book whose lookup is waiting.

**Out**
- Pacing the cover fetches: COV-2 uses this pacing if it can.

## Acceptance criteria

- [x] A batch of 20 lookups, with Open Library stubbed to answer 429 past one a second, fills in every book: a unit test on recorded responses. **Shown 2026-11-10:** `lookup-gate.test.ts` runs the batch of 20 on recorded responses, with fake timers: no two requests go out under a second apart, and every book is filled in.
- [x] After a 429, the next request waits for `Retry-After`, or for the backoff. **Shown 2026-11-10:** `lookup-gate.test.ts` holds the next request for `Retry-After` in seconds and as a date, and for the backoff when the header is missing.
- [x] *Changed by the design of 2026-11-07:* The shelf shows how many of its books are waiting for a lookup, such as "3 books looking up", and shows nothing when none are waiting: a component test. **Shown 2026-11-10:** `ShelfView.test.ts` finds "3 books looking up", then "1 book looking up", and no line at none.

## Questions for the brainstorm

1. **Why did the queue send as fast as the device was online, when the pacing asked for one a second?** Proposed: find it first, with a test that fails, then fix the pacing in the worker.
2. **How is a waiting lookup shown?** Proposed: a small "looking up" mark on the book, in place of the title, until it is found or not found.

## Documents to check on close

- [The architecture](../../ARCHITECTURE.md)'s Seams, for the pacing.

## Log

| Date | Event |
|---|---|
| 2026-11-07 | Written by the new sprint step. |
| 2026-11-07 | Designed: [the design](../../plans/LKP-2-lookup-pacing-design.md). Criterion 3 changed to a count of waiting lookups on the shelf. Days unchanged at 1. |
| 2026-11-09 | Build started by the build task step, on branch `lkp-2-lookup-pacing`. |
| 2026-11-09 | Step 1: `lookup-gate.test.ts` fails on the code as it was, with requests 40 ms apart, shown by `npm test`. The cause: the pacing covered the ISBN call alone, and each time the device came online a second worker started. |
| 2026-11-09 | Step 2: one gate for every request to Open Library, the ISBN call, each Authors call and COV's cover fetches, at most one a second, with one worker however often the device comes online, shown by `npm test`. The cover fetches aren't in the design: COV-2 left them for this pacing, and both call Open Library. |
| 2026-11-10 | Step 3: a 429 holds the gate for `Retry-After`, in seconds or as a date, or for the backoff, shown by `npm test`. A live 429 showed that Open Library's headers let a browser read `Retry-After`. |
| 2026-11-10 | Step 4: the shelf's count of waiting lookups, "1 book looking up" or "N books looking up", shown by `npm test` (`ShelfView.test.ts`). |
| 2026-11-10 | What shows each criterion, for the close: 1. `lookup-gate.test.ts`, the batch of 20 on recorded responses · 2. `lookup-gate.test.ts`, for `Retry-After` in seconds, as a date and missing · 3. `ShelfView.test.ts`, the count at 3, at 1 and at none |
| 2026-11-10 | Built by the build task step, on branch `lkp-2-lookup-pacing`. The close is next. |
| 2026-11-10 | Closed by the close task step: `completed`, every criterion shown. Review: L1 applied, the gate's interval has one name; M1 left at the user's word: the gate keeps a `Retry-After` wait in memory alone, so a reload during the wait sends the next request at once, and the user would rather see whether readers meet it before the wait is stored. Documents: the architecture's seam to Open Library, by the sync. |
