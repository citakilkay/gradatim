# Shelf · The releases

*One entry for each release, newest last, and a dated note under one that is rolled back. Written by the release step.*

## 0.1.0 · 2026-11-14

- **Holds:** OPS-1 and OPS-2, from [sprint 1](sprints/sprint-1/README.md); STO-2, APP-2, SHF-3 and BOK-3, from [sprint 2](sprints/sprint-2/README.md).
- **Commit:** `ecb8325` on `main`.
- **How:** the gate passed locally, then `git push origin main` by the release step; Cloudflare Pages built and deployed `main` on its own; `npx wrangler pages deployment list --project-name shelf` showed `ecb8325` as Production with no Failure, by the release step, as [the runbook](RUNBOOK.md) says.
- **The check:** `npm run test:e2e:at -- http://localhost:63542`, the address from `npx wrangler pages project list`, passed its 12 tests at a desktop's and a phone's width; the footer reads `Shelf 0.1.0` beside "Report a problem" on `/` and `/add`, by a fetch and the footer test; Shelf opens offline and shows the shelves, by the offline and shelves tests; a preview's footer showing its pull request's number is not this release's, since the open issue `2026-11-09-OPS-2-preview-footer-pr-number.md` holds it; a book's title, author and cover filling in is not this release's, since the deferred LKP-1 and COV-1 items hold it.
- **Result:** shipped.
