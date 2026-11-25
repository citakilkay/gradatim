# Shelf · The releases

*One entry for each release, newest last, and a dated note under one that is rolled back. Written by the release step.*

## 0.1.0 · 2026-11-15

- **Holds:** OPS-1, STO-1, APP-1, SHF-1, BOK-1, LKP-1, BOK-2 and SHF-2, from [sprint 1](sprints/sprint-1/README.md).
- **Commit:** `3e8c1f4` on `main`.
- **How:** the step ran `npm run deploy` to the production project on Cloudflare Pages, as [the runbook](RUNBOOK.md) says.
- **The check:** the site opened at the production address; a second visit with the network off didn't load the shell; adding a book by hand and moving it to another shelf weren't reached.
- **Result:** failed: after the second visit, the shell didn't load with the network off.

> **Rolled back, 2026-11-15.** The fault is in APP-1's service worker, which served the old files after the second visit, and then none. Production went back to the holding page, as the runbook's rollback says, and the holding page opened. The fix opens the next sprint.
