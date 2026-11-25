# Shelf

A small web app where a reader keeps track of their books, on shelves they name, online and offline.

## Running it

- `npm install`, then `npm run dev` for the dev server.
- `npm run check`, `npm test` and `npm run test:e2e` before a pull request.
- `npm run build` writes the static app to `build/`.

## Releases

Cloudflare Pages deploys `main` to production, and each pull request to a preview. To see which version is running, open the deployment in the Cloudflare Pages dashboard: the app itself doesn't show its version.
