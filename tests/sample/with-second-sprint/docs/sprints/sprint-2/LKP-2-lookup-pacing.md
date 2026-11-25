# LKP-2 · Pace the lookups, back off on 429, and show a waiting lookup

Parent: [sprint 2](README.md)

| | |
|---|---|
| Status | `to-do` |
| Story | M4 |
| Depends on | — |
| Takes | `2026-11-10-LKP-1-open-library-rate-limit.md` |

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

- [ ] A batch of 20 lookups, with Open Library stubbed to answer 429 past one a second, fills in every book: a unit test on recorded responses.
- [ ] After a 429, the next request waits for `Retry-After`, or for the backoff.
- [ ] A book whose lookup waits shows that it is waiting: a component test.

## Questions for the brainstorm

1. **Why did the queue send as fast as the device was online, when the pacing asked for one a second?** Proposed: find it first, with a test that fails, then fix the pacing in the worker.
2. **How is a waiting lookup shown?** Proposed: a small "looking up" mark on the book, in place of the title, until it is found or not found.

## Documents to check on close

- [The architecture](../../ARCHITECTURE.md)'s Seams, for the pacing.

## Log

| Date | Event |
|---|---|
| 2026-11-07 | Written by the new sprint step. |
