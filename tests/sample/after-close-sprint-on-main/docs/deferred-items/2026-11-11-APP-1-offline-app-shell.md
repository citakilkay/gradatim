Status: open

# The offline app shell: service worker, manifest and online status

*Deferred at sprint 1's close, 2026-11-11. It came from APP-1.*

## What it still needs

- The service worker that caches the app shell, so that after a first visit Shelf opens and runs with no network (M1, D3); its cache name follows the app's version.
- The web app manifest with its icons, so that the browser offers to install Shelf (M1).
- The online status that the lookup will watch, at the seam the architecture names.
- Shown by: a Playwright test that opens Shelf with the network off after a first visit; the browser's offer to install it.
- Done already: the SvelteKit project and its root layout, from OPS-1, and the footer with the version in that layout, from OPS-2.

## Log

| Date | Event |
|---|---|
| 2026-11-11 | Written by sprint 1's close: `open`. |
