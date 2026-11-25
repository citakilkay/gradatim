# APP-2 · Service worker serves the new shell offline after an update

Parent: [sprint 2](README.md)

| | |
|---|---|
| Status | `to-do` |
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

- [ ] A reader visits Shelf, a new build is deployed, they visit again, turn the network off, and Shelf loads: a Playwright test.
- [ ] With the network off, the reader adds a book by hand and moves it to another shelf, as the release check does.
- [ ] No cache is deleted before the new one holds every file of the build.

## Questions for the brainstorm

1. **When does the new worker take over?** APP-1 had it wait and offer a reload. Proposed: keep the wait and the offer, and fix the cache's install and clean-up so that the waiting worker never leaves the reader with no files.
2. **How is the fault reproduced?** Proposed: a Playwright test that serves two builds in turn, written before the fix.

## Documents to check on close

- [The runbook](../../RUNBOOK.md): the release check, if it changes.

## Log

| Date | Event |
|---|---|
| 2026-11-07 | Written by the new sprint step. |
