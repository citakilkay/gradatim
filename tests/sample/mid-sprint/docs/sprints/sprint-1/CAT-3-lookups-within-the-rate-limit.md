# CAT-3 · Lookups within the rate limit

Parent: [sprint 1](README.md)

| | |
|---|---|
| Status | `to-do` |
| Story | M1 |
| Depends on | CAT-1 |
| Takes | `2026-11-04-CAT-1-rate-limits.md` |

## Goal

Lookups by ISBN stay within Open Library's limit of 100 per IP every 5 minutes, even for a batch.

## Acceptance criteria

- [ ] A batch of twenty lookups runs through a queue, and none gets a 403. *Moved from CAT-1 at its close.*
- [ ] A lookup that would pass the limit waits, and the reader sees that it is waiting.

## Log

| Date | Event |
|---|---|
| 2026-11-05 | Written by "add a task" at CAT-1's close, with the criterion CAT-1 couldn't meet. Takes `2026-11-04-CAT-1-rate-limits.md`. |
