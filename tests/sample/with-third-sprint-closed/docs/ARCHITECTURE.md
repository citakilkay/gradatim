# Shelf · The architecture

*The architecture step's architecture, written on 2026-11-07, from [its records](decisions/architecture.md). It rests on D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11, D12, D13 and D15 ([the decisions](decisions/README.md)).*

## Overview

Shelf is a static SvelteKit app in TypeScript, served from Cloudflare Pages (D10, D12). It runs entirely in the reader's browser: a service worker caches the app shell, and IndexedDB, through Dexie, holds the shelves, the books, the covers and a queue of lookups still to do (D3, D13). Adding a book writes it to the device at once (D4). The lookup worker drains the queue against Open Library's ISBN, Authors and Covers APIs whenever the device is online, and fills in the details (D1, D2, D6). Until phase 1 there is no server. The server, the sign-in and sync are chosen in P1.2, and the data model is ready for sync where the latest change wins (D9, D11).

## Modules

| Code | Module | What it holds | Stories |
|---|---|---|---|
| APP | App shell | The SvelteKit layout and routes, the service worker, the web app manifest and the online status (D10) | M1 |
| STO | Device store | The Dexie database, its schema and migrations, and the sync-ready row fields (D13, D11) | |
| SHF | Shelves | Shelves and moving books between them: the three starting shelves, the Finished mark, finished dates, the yearly count and sorting (D5, D7) | M2, M7, M8, P1.1, P2.3 |
| BOK | Books | Adding a book by ISBN, typing the details by hand, removing a book, and finding books across shelves (D4) | M3, M5, P2.1, P2.2, M10 |
| LKP | Lookup | The Open Library client, the request pacing and the retry queue that fills in titles and authors (D1, D2, D4) | M4 |
| COV | Covers | Fetching covers by cover ID, storing them on the device or keeping only the URL, and the placeholder (D6) | M6, M9 |
| SYN | Account and sync | Sign-up, sign-in and syncing with the server, where the latest change wins (D3, D9, D11) | P1.2, P1.3 |
| OPS | Hosting and release | The Cloudflare Pages project, the build, the previews and the rollback (D12, D15) | |

## Seams

- **The views and the data:** the components in SHF and BOK read through Dexie live queries and write through each module's own functions (`shelves.ts`, `books.ts`). No component calls Dexie directly.
- **BOK to LKP:** adding a book writes the book and a queue entry in one transaction. LKP watches the queue and the online status from APP, and writes the title, the author and the cover ID back to the book, or marks it `not-found`. That mark lets BOK offer to type the details by hand (M5).
- **LKP to Open Library:** `GET https://openlibrary.org/isbn/{isbn}.json`, then `GET /authors/{key}.json` for each author (D2). Requests go one at a time, at most one a second, with backoff on errors and on 429, and a 404 means not found. No key or cookie is sent.
- **LKP to COV:** once a book has a cover ID, COV fetches `https://covers.openlibrary.org/b/id/{id}-M.jpg` and stores the Blob. Whether the image is stored or only its URL is kept is one switch, which M9 sets from Open Library's answer (D6).
- **SYN to the server:** chosen by P1.2 (D11). SYN reads and writes rows through STO, using their updated-at times.

## Data

All data lives in one IndexedDB database, which STO owns. Every row has an `id` (a random UUID), `updatedAt` (a timestamp) and `deleted` (a soft-delete flag, so that a removal can sync), as D11 assumes.

- `shelves`: name, position, and `isFinished` for the marked Finished shelf (D5). SHF owns it.
- `books`: ISBN, shelf id, title, authors, cover ID, `lookup` (`pending`, `found`, `not-found` or `manual`), `addedAt`, and `finishedAt`, set when the book is moved onto Finished, cleared when it is moved off, and editable (D5, D7). BOK owns it, and SHF changes its shelf and finished date.
- `covers`: the book id, and either the image Blob or only the URL (D6). COV owns it.
- `lookups`: the book id, the number of tries and the time of the next try. LKP owns it.

## Deployment

The app is a static build (`npm run build`) that Cloudflare Pages serves over HTTPS. Pages builds and deploys each push to `main` to production, and each pull request to a preview address (D12). There is no server until P1.2 (D11). Pages applies `static/_headers`, which the build copies to `build/`, to every path: the security headers. [The runbook](RUNBOOK.md) says how a release goes out.

## Testing

- **Unit (Vitest):** the store's functions, the finished-date rules, the yearly count, and the Open Library client against recorded responses, with the pacing and the retries.
- **Component (Vitest with Testing Library):** the shelf and add-book views.
- **End to end (Playwright):** each story's done-when, including runs with the network off and with Open Library stubbed as down or as not knowing the ISBN.
- **The gate:** `npm run check`, `npm test`, `npm run test:e2e` and `npm run build` pass before each task's commit on `main`, or before a task's own branch merges (D15).

## Open choices

| Choice | Decided by | Until then | Record |
|---|---|---|---|
| The server, sign-in and sync transport | P1.2 | No server; every row has an id, an updated-at time and a deleted flag | D11 |

## Change log

| Date | Change |
|---|---|
| 2026-11-07 | Written by the architecture step |
| 2026-11-09 | Each task built and committed on `main`, with no branch or pull request of its own, since one developer works on Shelf: D15 replaces D14 |
| 2026-11-13 | M10 in BOK: the picks of the review after sprint 2 |
| 2026-11-14 | The security headers Pages applies to every path, from OPS-3's close (OPS-3) |
