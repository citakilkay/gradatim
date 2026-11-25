# OPS-1 · Project setup and Cloudflare Pages: design

*The design of task [OPS-1](../sprints/sprint-1/OPS-1-project-setup.md), for the MVP. Written by the design task step on 2026-11-07.*

## The idea

- A SvelteKit project in TypeScript with the static adapter, so that `npm run build` writes plain files to `build/` that Cloudflare Pages serves (D10, D12).
- The gate is split in two. Cloudflare Pages' own Git build runs check, the unit tests and the build for every push, and a GitHub Actions job runs the full gate, Playwright included, on each pull request (decision 1).
- Pages deploys `main` to production and each pull request's branch to a preview address. Previews and rollbacks stay Cloudflare's own (D12).
- Node is pinned in `.nvmrc` to Node 24, and `engines` in `package.json` matches it. Pages' v3 build image reads `.nvmrc` but not `engines`, and Actions reads `.nvmrc` through `setup-node` (chosen for the user).
- The Pages project uses the default `*.pages.dev` address and its default public previews. The app holds no secrets and no data on the server, so a public preview exposes nothing (chosen for the user).
- The placeholder page is one route with a heading, and each kind of test has one test against it: a unit test, a component test and a Playwright test (chosen for the user).
- `npm run deploy` runs Wrangler's `pages deploy build/` for a deploy by hand, as the runbook says. No Cloudflare token is stored in GitHub (decision 1).

## The user's decisions

1. **Pages' Git build runs check, unit tests and build, and a GitHub Actions job runs the full gate, Playwright included, on each pull request.** *Over:* running the whole gate, Playwright included, inside Pages' build, which depends on Playwright's browser running in Pages' gVisor container on Ubuntu 22.04, which Cloudflare's docs don't confirm. Also over GitHub Actions building and uploading through Wrangler with Pages' Git build off, which ties every deploy to a Cloudflare API token kept as a GitHub secret.

## Steps

### 1. The SvelteKit project builds static

- A SvelteKit project in TypeScript, with the static adapter writing to `build/`, and prerendering on for the placeholder route.
- `.nvmrc` pins Node 24, and `engines` in `package.json` matches it.
- The npm scripts `dev`, `check` (svelte-check), `build` and `preview` exist, as the commands doc words them.
- `build/` and `node_modules/` are ignored by git.

**Done when:** `npm install`, `npm run check` and `npm run build` pass on a clean clone, and `build/index.html` exists.

*Changed in the build, 2026-11-08:* SvelteKit 3 refuses `svelte.config.js`, so its config goes to the `sveltekit()` plugin in `vite.config.ts`, and `tsconfig.json` extends `$app/tsconfig`. TypeScript stays on 6, which kit 3.1 and svelte-check 4.7 require. `engines` reads `>=24`, so that a newer local Node runs without warnings, while `.nvmrc` pins 24 for Pages and Actions.

### 2. Unit, component and end-to-end tests run

- Vitest with jsdom and Testing Library runs `npm test`. It holds one unit test of a small function and one component test that renders the placeholder page and finds its heading.
- Playwright runs `npm run test:e2e` against the production build served by `npm run preview`, never the dev server, with Chromium. It holds one test that opens the page and sees its heading.
- The Playwright and Vitest test folders stay apart, so that neither runner picks up the other's files.

**Done when:** each of the three tests fails first against a page without the heading, then passes, and `npm test` and `npm run test:e2e` pass locally.

### 3. The gate runs on each pull request

- A GitHub Actions workflow runs on each pull request to `main`, and on each push to `main`. It installs with `npm ci` on the Node from `.nvmrc`, installs Playwright's Chromium with its system libraries, and runs check, test, test:e2e and build in that order (decision 1).
- The job's name is stable, so that the user can require it in `main`'s branch protection.

**Done when:** a pull request shows the workflow's job passing, and a deliberately broken test on a scratch branch makes it fail.

### 4. Cloudflare Pages deploys previews and production

- The user creates the Pages project from the GitHub repository, with production branch `main`, output folder `build`, and the build command `npm run check && npm test && npm run build` (decision 1).
- Pages reads the Node version from `.nvmrc`. If the v3 image can't install Node 24, the build sets `NODE_VERSION` instead, and the design's change log says so.
- `npm run deploy` runs Wrangler's `pages deploy build` with the project's name, for a deploy by hand. Wrangler is a dev dependency, and it logs in interactively, so no token is stored.

**Done when:** a pull request gets a Pages preview address that serves the placeholder page, and the merge of OPS-1's pull request deploys it to the production address.

### 5. The documents match what was built

- Each command in the commands doc has its Built by set to OPS-1, and `npm run test:e2e`'s line says it runs against the production build.
- The runbook names the Pages project, its build command, its output folder and the Node pin, and notes the Actions job as the gate's other half.

**Done when:** the commands doc has no `planned` command left, and the runbook names the Pages project.

## Acceptance criteria

| # | Criterion | Step | Shown by |
|---|---|---|---|
| 1 | `npm run check`, `npm test`, `npm run test:e2e` and `npm run build` pass on a placeholder page, each with at least one test. | 1, 2 | The four commands passing locally and in the Actions job |
| 2 | A pull request gets a Cloudflare Pages preview address that serves the build. | 4 | The preview address on OPS-1's pull request, opened in a browser |
| 3 | Each command in the commands doc has its Built by set to OPS-1. | 5 | The commands doc |
| 4 | *New:* a GitHub Actions job runs the full gate, Playwright included, on each pull request to `main`, and Pages' build runs check, the unit tests and the build. | 3, 4 | The job on OPS-1's pull request, and the Pages project's build command |

## The estimate

1 dev-day: unchanged. The MVP's setup task, outside the stories' 8.75 dev-days.

## Documents

**With this design:** the Design row in OPS-1's header, criterion 4 added to OPS-1's criteria as new, and a log row in OPS-1 and in the sprint's README. The days don't move.

**At the close:** the commands doc (each Built by, and the e2e line); the runbook (the Pages project, its build command and the Actions job); the architecture's Deployment and Testing, since the gate now runs half on Pages and half in GitHub Actions; and the development cycle's "Before a merge", which says the gate passes on the Pages preview build.

## Watch for

- The Pages build image's Node versions: Cloudflare's [build image page](https://developers.cloudflare.com/pages/configuration/build-image/) gives Node 22 as the v3 default, reads `.nvmrc`, and ignores `engines`. The build confirms Node 24 installs there before relying on it.
- The development cycle's line that the gate passes "on the Cloudflare Pages preview build" no longer holds word for word: Playwright runs in Actions. The close updates that line and the architecture's Testing, as Documents says.
- A merge isn't blocked by the Actions job until the user requires it in `main`'s branch protection. The close tells the user how, and the build doesn't change repository settings itself.
- Playwright against `npm run preview` needs the build first. The e2e script builds, or the Playwright config's web server runs the build, so that `npm run test:e2e` works on its own.
- The Pages project, the GitHub connection and the branch protection are set up by the user in their own accounts. The build gives the exact settings and waits for them.

## Change log

| Date | Change |
|---|---|
| 2026-11-07 | Written by the design task step. |
| 2026-11-08 | Step 1 changed in the build: the SvelteKit config lives in `vite.config.ts`, TypeScript 6, and `engines` reads `>=24`. |
