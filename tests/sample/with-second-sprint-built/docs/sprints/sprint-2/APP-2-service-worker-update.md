# APP-2 · Service worker serves the new shell offline after an update

Parent: [sprint 2](README.md)

| | |
|---|---|
| Status | `completed` |
| Story | M1 |
| Depends on | — |
| Takes | — |

## Goal

After a second visit that brings a new version, Shelf still opens with the network off, from a complete cache of the current build, so that release 0.1.0's check passes and it can go out again (M1, D3).

## Scope

**In**
- Finding why the service worker served the old files and then none, as the release record says for 0.1.0.
- Installing a new version's files before it takes over, and removing an old cache only once the new one is complete.
- A Playwright test of the release check: visit twice across a new build, turn the network off, and the shell loads.

**Out**
- The release itself, which the release step runs once the sprint closes.

## Acceptance criteria

- [x] A reader visits Shelf, a new build is deployed, they visit again, turn the network off, and Shelf loads: a Playwright test. **Shown 2026-11-08:** `e2e/update-offline.test.ts` serves two builds in turn and loads the shell with the network off after the second visit; it failed first on the old worker.
- [x] With the network off, the reader adds a book by hand and moves it to another shelf, as the release check does. **Shown 2026-11-08:** the same test adds a book by hand and moves it onto Finished, with the network off.
- [x] No cache is deleted before the new one holds every file of the build. **Shown 2026-11-08:** `service-worker.test.ts` stops an install halfway and finds the old cache whole.

## Questions for the brainstorm

1. **When does the new worker take over?** APP-1 had it wait and offer a reload. Proposed: keep the wait and the offer, and fix the cache's install and clean-up so that the waiting worker never leaves the reader with no files.
2. **How is the fault reproduced?** Proposed: a Playwright test that serves two builds in turn, written before the fix.

## Documents to check on close

- [The runbook](../../RUNBOOK.md): the release check, if it changes.

## Log

| Date | Event |
|---|---|
| 2026-11-07 | Written by the new sprint step. |
| 2026-11-08 | Build started by the build task step, on branch `app-2-service-worker-update`. |
| 2026-11-08 | The cause: the worker deleted the old cache as it took over, before the new cache held every file, so a visit that was cut short left neither. `e2e/update-offline.test.ts`, which serves two builds in turn, failed on it. |
| 2026-11-08 | The new worker fills its cache while it waits, and removes the old cache only once every file of the build is in the new one, shown by `npm test` and `npm run test:e2e`. |
| 2026-11-08 | What shows each criterion, for the close: 1. `e2e/update-offline.test.ts` loads the shell with the network off after a second visit to a new build · 2. the same test adds a book by hand and moves it, with the network off · 3. `service-worker.test.ts` stops an install halfway and finds the old cache whole |
| 2026-11-08 | Built by the build task step, on branch `app-2-service-worker-update`. The close is next. |
| 2026-11-08 | Closed by the close task step: `completed`, every criterion shown. Review: L1 applied, the two cache names come from one constant; no other findings. Documents: none: the runbook's check holds as written. |
