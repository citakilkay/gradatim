# OPS-1 · Project setup and Cloudflare Pages

Parent: [sprint 1](README.md)

| | |
|---|---|
| Status | `completed` |
| Story | the MVP |
| Depends on | — |
| Takes | — |
| Design | [the design](../../plans/OPS-1-project-setup-design.md) |

## Goal

A SvelteKit app in TypeScript, built static, passes the gate locally and deploys to Cloudflare Pages: each pull request to a preview, and `main` to production (D10, D12, D14).

## Scope

**In**
- The SvelteKit project with the static adapter, TypeScript, svelte-check, Vitest, Testing Library and Playwright.
- The npm scripts in [the commands](../../agents/commands.md): install, dev, check, test, test:e2e, build, preview and deploy.
- The Cloudflare Pages project, with preview builds for pull requests and production from `main`.

**Out**
- The service worker and the manifest: APP-1.
- The Dexie database: STO-1.

## Acceptance criteria

- [x] `npm run check`, `npm test`, `npm run test:e2e` and `npm run build` pass on a placeholder page, each with at least one test.
- [x] A pull request gets a Cloudflare Pages preview address that serves the build.
- [x] Each command in the commands doc has its Built by set to OPS-1.
- [x] *New, by the design of 2026-11-07:* a GitHub Actions job runs the full gate, Playwright included, on each pull request to `main`, and Pages' build runs check, the unit tests and the build.

## Questions for the brainstorm

1. **Does Pages build the app, or does a CI job build it and `npm run deploy` upload it?** D12 names Pages, and the gate must pass on the preview build. Proposed: Pages' own Git build, with the gate run there through the build command.
2. **Which Node version is pinned?** Pages and the local machine must agree. Proposed: the current Node LTS, pinned in `.nvmrc` and `engines`.

## Documents to check on close

- [The commands](../../agents/commands.md): each command built.
- [The runbook](../../RUNBOOK.md): the Pages project's name and settings.
- [The architecture](../../ARCHITECTURE.md)'s Deployment, if the build differs.

## Log

| Date | Event |
|---|---|
| 2026-11-07 | Written by the new sprint step. |
| 2026-11-07 | Designed by the design task step: [the design](../../plans/OPS-1-project-setup-design.md). The gate runs in GitHub Actions, and Pages runs check, test and build. One criterion added; days unchanged. |
| 2026-11-08 | Build started by the build task step, on branch `ops-1-project-setup`. |
| 2026-11-08 | Step 1: the SvelteKit project builds static to `build/`, Node 24 in `.nvmrc`, shown by `npm install`, `npm run check` (0 errors) and `npm run build` on a clean state, with `build/index.html` written. |
| 2026-11-08 | Step 2: Vitest with jsdom and Testing Library holds a unit test and a component test, and Playwright holds one test against the production build; each failed first on a page with no heading, shown by `npm test` (2 passed) and `npm run test:e2e` (1 passed). Kit 3 dropped `$lib`, so code imports `#lib` through `package.json` imports; Playwright keeps no CI-only retries for now. |
| 2026-11-08 | Step 3: `.github/workflows/gate.yml`, job `gate`, runs `npm ci`, Playwright Chromium, check, test, test:e2e and build on each pull request and push to `main`; shown locally by the YAML parsing and the four commands passing after `npm ci` on a clean state. Its run on GitHub waits for the remote. |
| 2026-11-08 | Step 4: `npm run deploy` runs `wrangler pages deploy build --project-name shelf`, with Wrangler as a dev dependency, shown by `npx wrangler pages deploy --help`. The Pages project, its previews and production are the user's to set up. |
| 2026-11-08 | Step 5 left to the close: its work is the commands doc and the runbook, which are close task's. |
| 2026-11-08 | What shows each criterion, for the close: 1. check, test (2), test:e2e (1) and build pass locally and in the Actions run · 2. the user saw the test pull request's Pages preview serve the page · 3. open: the close sets each Built by · 4. gate.yml's job passed on the pull request, and the Pages build command is check, test and build |
| 2026-11-08 | Built by the build task step, on branch `ops-1-project-setup`. The close is next. |
| 2026-11-08 | Closed: every criterion met. Status `completed`. |
| 2026-11-10 | The Pages project is named `shelf-app` now: the user renamed it in Cloudflare's dashboard, and `npm run deploy` follows. |
