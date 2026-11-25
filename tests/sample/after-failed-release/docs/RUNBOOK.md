# Shelf · The runbook

*How a release goes out, written by the architecture step on 2026-11-07, from [the architecture](ARCHITECTURE.md). A command marked planned in [the commands](agents/commands.md) doesn't exist yet.*

## Before a release

- `npm run check`, `npm test`, `npm run test:e2e` and `npm run build` pass on `main`.
- The version in `package.json` is bumped, and the service worker's cache name follows it, so that installed apps pick up the release.
- A release that changes the Dexie schema adds a new schema version with its migration, never an edit to an old one, and the migration is tested on data from the previous release.
- Before the first public release, Open Library's answer about stored covers is recorded, and Shelf follows it (M9, D6).
- A release that changes `static/_headers` has its browser tests run where Pages applies the headers, such as a pull request's Pages preview, with `npm run test:e2e:at -- <the preview's address>`, before `main` is pushed: the local gate serves the build without them, so it can't show what they block, as release 0.2.0 showed.

## A release

1. Push `main`, which holds each task's commit since the last release (D15).
2. Cloudflare Pages builds and deploys `main` on its own: the project `shelf`, with the build command `npm run check && npm test && npm run build`, the output folder `build`, and Node 24 from `.nvmrc`. The Actions job `gate` runs the full gate, Playwright included, on each pull request. To deploy by hand instead, run `npm run build`, then `npm run deploy`.
3. Wait for the deployment to show as successful: first in `npx wrangler pages deployment list --project-name shelf`, as Production, with no Failure, or in the Cloudflare Pages dashboard.

## The check

- The production address is `shelf`'s domain in `npx wrangler pages project list`.
- Run the browser tests there: `npm run test:e2e:at -- <the production address>`. They pass at a desktop's and a phone's width.
- Open the production address: every page's footer shows `Shelf <version>`, with the version from `package.json` read when the app was built, beside a "Report a problem" link. The pages are prerendered, so fetching each one, such as `curl -s <address>/`, reads its footer with no browser.
- Open a pull request's Pages preview: its footer shows the pull request's number, so that a preview is never taken for production.
- Reload once so the new service worker takes over, then turn the network off and reload again: Shelf opens and shows the shelves.
- Add a book by ISBN online: its title, author and cover fill in.

## A rollback

- In the Cloudflare Pages dashboard, open the project's deployments and choose "Rollback to this deployment" on the previous one.
- A release whose schema migration has already run on readers' devices can't be undone this way, since Dexie can't open a newer database with older code: fix forward with a new release instead.
- Check as above: the previous version shows in the footer, and Shelf opens offline.

## Change log

| Date | Change |
|---|---|
| 2026-11-07 | Written by the architecture step |
| 2026-11-08 | The Pages project's settings, the Actions gate, and a check of a preview's footer, from OPS-1's close (OPS-1) |
| 2026-11-09 | A release pushes `main`, where each task is committed: D15 replaces D14 |
| 2026-11-09 | The check reads `Shelf <version>` in every page's footer, the version from `package.json` at build time, beside the "Report a problem" link (OPS-2) |
| 2026-11-13 | The production address comes from Wrangler's project list, the browser tests run there, and a release waits on Wrangler's deployment list or the dashboard |
| 2026-11-14 | The check reads the footer by fetching the prerendered pages, from release 0.1.0 |
| 2026-11-14 | A release that changes `static/_headers` runs its browser tests on a Pages preview before `main` is pushed, from release 0.2.0's rollback |
