# Commands

What to run in Shelf, and what each command does. A command marked `planned` doesn't exist yet: the task that builds it sets its Built by to its id.

| Command | What it does | Built by |
|---|---|---|
| `npm install` | Installs the dependencies | planned |
| `npm run dev` | Starts the dev server with hot reload | planned |
| `npm run check` | Type-checks the Svelte and TypeScript code with svelte-check | planned |
| `npm test` | Runs the unit and component tests in Vitest | planned |
| `npm run test:e2e` | Runs the Playwright tests against a production build, offline runs included | planned |
| `npm run build` | Builds the static app and its service worker into `build/` | planned |
| `npm run preview` | Serves the production build locally, to try the service worker | planned |
| `npm run deploy` | Deploys `build/` to Cloudflare Pages with Wrangler, by hand | planned |
