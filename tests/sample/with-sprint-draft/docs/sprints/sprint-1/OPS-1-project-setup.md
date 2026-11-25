# OPS-1 · Project setup and Cloudflare Pages

Parent: [sprint 1](README.md)

| | |
|---|---|
| Status | `to-do` |
| Story | the MVP |
| Depends on | — |
| Takes | — |

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

- [ ] `npm run check`, `npm test`, `npm run test:e2e` and `npm run build` pass on a placeholder page, each with at least one test.
- [ ] A pull request gets a Cloudflare Pages preview address that serves the build.
- [ ] Each command in the commands doc has its Built by set to OPS-1.

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
