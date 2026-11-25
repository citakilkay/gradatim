# APP-2 · Offline app shell

Parent: [sprint 2](README.md)

| | |
|---|---|
| Status | `completed` |
| Story | M1 |
| Depends on | — |
| Takes | `2026-11-11-APP-1-offline-app-shell.md` |

## Goal

Shelf installs as a web app, and after a first visit it opens and runs with no network (M1, D3).

## Scope

**In**
- All that the deferred item carries, since APP-1's build had not started.
- The service worker that caches the app shell, its cache named after the app's version.
- The web app manifest with its icons.
- The online status that LKP will watch.

**Out**
- The shelves view: SHF-3.

## Acceptance criteria

- [x] A reader opens Shelf with the network off, after a first visit, and it loads: a Playwright test. **Shown 2026-11-11:** `e2e/offline.test.ts` opens Shelf, waits for the service worker, turns the network off and reloads: the heading and the footer show, on a page the worker serves, at a desktop's and a phone's width.
- [x] The browser offers to install Shelf. **Shown 2026-11-11:** `e2e/offline.test.ts` asks Chromium, through its DevTools protocol, for the page's manifest and for anything that would stop it offering to install Shelf: the manifest, linked from `src/app.html`, has no error, and nothing stops the install.

## Questions for the brainstorm

1. **SvelteKit's own service worker or a library such as Workbox?** Proposed: SvelteKit's `$service-worker` module, which knows the build's files.
2. **How does a new version reach a reader?** Proposed: the new worker takes over once it is installed, and the next reload shows the new version, as the runbook's check reads.

## Documents to check on close

- [The MVP](../../MVP.md): M1's status.
- [The architecture](../../ARCHITECTURE.md)'s Seams, for the online status.

## Log

| Date | Event |
|---|---|
| 2026-11-11 | Written by the new sprint step. |
| 2026-11-11 | Build started by the build task step, on `main`, with no branch of its own. |
| 2026-11-11 | SvelteKit 3 has no `$service-worker` module, which the first question proposed: `src/service-worker.ts` takes the build's files, the static files and the prerendered pages from `$app/manifest`, and SvelteKit builds and registers it. Its cache is named after the version in `package.json`, as the runbook says, and the new worker takes over once it is installed, as the second question proposed. The root `tsconfig.json` leaves the worker out, as SvelteKit asks, since it runs on the WebWorker types. |
| 2026-11-11 | `static/manifest.webmanifest`, with its SVG icon, `static/icon.svg`, is linked from `src/app.html`; `src/lib/online.ts` gives the online status, from the browser's online and offline events, for LKP to watch. Shown by `npm test` (`online.test.ts` failed first on the missing module, then 11 passed), `npm run check` (0 errors), `npm run build`, and `npm run test:e2e` (`offline.test.ts` failed first with no worker, then passed). |
| 2026-11-11 | The Playwright tests run at a desktop's width and at a phone's, a Pixel 7's, where Shelf is installed most, and keep each test's last screen in `test-results/`, which git ignores, through `playwright.config.ts`. Shown by `npm run test:e2e` (8 passed). |
| 2026-11-11 | What shows each criterion, for the close: 1. `e2e/offline.test.ts` reloads Shelf with the network off after a first visit, and finds the heading and the footer on a page the worker serves, at both widths · 2. `e2e/offline.test.ts` gets the manifest with no error from Chromium, and no reason not to offer the install |
| 2026-11-11 | Built by the build task step, on `main`, with no branch of its own. The close is next. |
| 2026-11-11 | Closed by the close task step: `completed`, every criterion shown. Review: M1 applied, the worker answers only GET requests on Shelf's own origin, so that Open Library's calls pass it by. Documents: the commands doc's `npm run test:e2e` line, by the sync: the tests run at a desktop's and a phone's width, and keep each test's last screen in `test-results/`. |
