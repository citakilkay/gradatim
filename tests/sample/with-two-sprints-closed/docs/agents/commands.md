# Commands

What to run in Shelf, and what each command does. A command marked `planned` doesn't exist yet: the task that builds it sets its Built by to its id.

| Command | What it does | Built by |
|---|---|---|
| `npm install` | Installs the dependencies | OPS-1 |
| `npm run dev` | Starts the dev server with hot reload | OPS-1 |
| `npm run check` | Type-checks the Svelte and TypeScript code with svelte-check | OPS-1 |
| `npm test` | Runs the unit and component tests in Vitest | OPS-1 |
| `npm run test:e2e` | Runs the Playwright tests against a production build, offline runs included, each at a desktop's and a phone's width, and keeps each test's last screen in `test-results/` | OPS-1 |
| `npm run build` | Builds the static app and its service worker into `build/` | OPS-1 |
| `npm run preview` | Serves the production build locally, to try the service worker | OPS-1 |
| `npm run deploy` | Deploys `build/` to Cloudflare Pages with Wrangler, by hand | OPS-1 |
