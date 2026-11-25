# Shelf · The runbook

*How a release goes out, written by the architecture step on 2026-11-07, from [the architecture](ARCHITECTURE.md). A command marked planned in [the commands](agents/commands.md) doesn't exist yet.*

## Before a release

- `npm run check`, `npm test`, `npm run test:e2e` and `npm run build` pass on `main`: the GitHub Actions job `gate` passed on the release's pull request, since Pages' build runs no Playwright.
- The version in `package.json` is bumped, and the service worker's cache name follows it, so that installed apps pick up the release.
- A release that changes the Dexie schema adds a new schema version with its migration, never an edit to an old one, and the migration is tested on data from the previous release.
- Before the first public release, Open Library's answer about stored covers is recorded, and Shelf follows it (M9, D6).

## A release

The gate runs in two halves (OPS-1):
- **Cloudflare Pages:** the project `shelf`, connected to the GitHub repository, with production branch `main`, build command `npm run check && npm test && npm run build`, output folder `build`, and Node from `.nvmrc` (24). Each pull request's branch gets a public preview address under `*.shelf.pages.dev`, and `main` deploys to production.
- **GitHub Actions:** the workflow `.github/workflows/gate.yml`, job `gate`, on each pull request to `main` and each push to `main`. It runs `npm ci`, installs Playwright's Chromium with its system libraries, then check, test, test:e2e and build. It blocks a merge only once `gate` is required in `main`'s branch protection.

1. Merge the release's pull request into `main`, squashed (D14).
2. Cloudflare Pages builds and deploys `main` on its own. To deploy by hand instead, run `npm run build`, then `npm run deploy`, which runs `wrangler pages deploy build --project-name shelf`. Wrangler asks you to log in, since no Cloudflare token is stored in GitHub.
3. Wait for the deployment to show as successful in the Cloudflare Pages dashboard.

## The check

- Open the production address: the new version shows in the app's footer.
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
| 2026-11-08 | The Pages project `shelf` and its settings, the Actions job `gate` as the gate's other half, and the deploy by hand with Wrangler (OPS-1) |
