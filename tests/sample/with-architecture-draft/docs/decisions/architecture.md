# The architecture's records

*The stack and the structure, as the architecture step agreed them with the user. Each run adds a dated section.*

## 2026-11-07

### D10 · A Svelte front end in TypeScript, built static

- **Decision:** Shelf's front end is TypeScript with SvelteKit, built as static files by its static adapter, with SvelteKit's service worker caching the app shell so that it installs and opens with no network. The browser calls Open Library directly.
- **Over:** React with Vite and vite-plugin-pwa, which brings the largest ecosystem but more code for an app this small. Also over plain TypeScript with no framework, which leaves all the UI state to hand-written code.
- **Why:** the MVP is one device and offline (M1, D3), and Open Library needs no key and allows CORS (D1, D2), so the browser needs no server in between. Svelte keeps the bundle small and has offline support built in. The user's answer.
- **Date:** 2026-11-07.

### D11 · The server, sign-in and sync are decided by P1.2

- **Decision:** the server, the sign-in and the sync's transport are decided by P1.2. Until then, the architecture assumes no server: every stored row carries a random id, an updated-at time and a deleted flag, so that sync where the latest change wins (D9) can be added without changing the data model.
- **Over:** choosing a hosted backend such as Supabase now, which ties the project to one provider before the MVP has shown anything. Also over writing our own Node API with SQLite now, which means running and securing a server that the MVP doesn't need.
- **Why:** accounts and sync come in phase 1 (P1.2, P1.3, D3), and they must stay free (D8). Choosing once the MVP works costs nothing, provided the data model is ready for sync. The user's answer.
- **Date:** 2026-11-07.

### D12 · Hosting on Cloudflare Pages

- **Decision:** the static build is hosted on Cloudflare Pages. Each push to `main` deploys to production, each pull request gets a preview build, and a rollback restores an earlier deployment.
- **Over:** GitHub Pages through Actions, where rolling back means redeploying an older commit. Also over Netlify, whose free-tier build limits are tighter.
- **Why:** it is free (D8) and serves HTTPS, which the install and the service worker need (M1). The user's answer.
- **Date:** 2026-11-07.

### D13 · Dexie on IndexedDB for the device store

- **Decision:** shelves, books, cover images (as Blobs) and the lookup queue live in IndexedDB, through Dexie, with versioned schema migrations.
- **Over:** raw IndexedDB through `idb`, which means writing migrations and queries by hand. Also over localStorage, which can't hold images and is too small.
- **Why:** offline shelves and covers need a store on the device (D3, D6, M2, M6). Dexie's live queries keep the Svelte views current. Chosen for the user, and kept by the user.
- **Date:** 2026-11-07.

### D14 · Vitest and Playwright, and the branch and pull request rules

- **Decision:** unit and component tests run in Vitest, and end-to-end tests in Playwright, including offline runs. Each task gets its own branch from `main`, and lands through a draft pull request that the user reviews and squash-merges once the gate passes.
- **Over:** Jest, which needs more setup with Vite. Also over Cypress, which handles offline and service-worker tests less well. Also over committing straight to `main`, which would deploy each commit (D12).
- **Why:** the MVP's done-when steps are offline flows (M1, M3, M6), which only a real browser can test. Chosen for the user, and kept by the user.
- **Date:** 2026-11-07.
