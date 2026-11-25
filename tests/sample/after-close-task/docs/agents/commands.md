# Commands

What to run in Shelf, and what each command does. A command marked `planned` doesn't exist yet: the task that builds it sets its Built by to its id.

Run them on Node 24, which `.nvmrc` pins; `engines` in `package.json` reads `>=24`.

| Command | What it does | Built by |
|---|---|---|
| `npm install` | Installs the dependencies | OPS-1 |
| `npm run dev` | Starts the dev server with hot reload | OPS-1 |
| `npm run check` | Type-checks the Svelte and TypeScript code with svelte-check | OPS-1 |
| `npm test` | Runs the unit and component tests in Vitest, with jsdom and Testing Library: the files `src/**/*.test.ts` | OPS-1 |
| `npm run test:e2e` | Runs the Playwright tests in `e2e/`, with Chromium, against the production build: its web server runs `npm run build && npm run preview -- --port 4173`, so it builds first on its own. A `test.only` fails the run when `CI` is set. The offline runs come with APP-1 | OPS-1 |
| `npm run build` | Builds the static app into `build/`. It writes no service worker yet: APP-1 adds it | OPS-1 |
| `npm run preview` | Serves the production build locally; once APP-1 adds the service worker, to try it | OPS-1 |
| `npm run deploy` | Deploys `build/` to the Cloudflare Pages project `shelf` by hand: `wrangler pages deploy build --project-name shelf`. Wrangler asks you to log in; no Cloudflare token is stored | OPS-1 |
