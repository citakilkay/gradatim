# Decisions

Where every decision stands. Decide and architecture add a row for each of theirs, and a decision that a later one replaces says so here.

| Decision | Title | Record | Status |
|---|---|---|---|
| D1 | Open Library for ISBN lookup | [01](01-book-lookup-and-shelves.md#d1--open-library-for-isbn-lookup) | holds |
| D2 | Open Library's ISBN API, with the Authors API for names | [01](01-book-lookup-and-shelves.md#d2--open-librarys-isbn-api-with-the-authors-api-for-names) | holds |
| D3 | An account, with shelves synced across devices | [01](01-book-lookup-and-shelves.md#d3--an-account-with-shelves-synced-across-devices) | holds |
| D4 | Adding a book never blocks | [01](01-book-lookup-and-shelves.md#d4--adding-a-book-never-blocks) | holds |
| D5 | Named shelves, one per book, with a marked Finished shelf | [01](01-book-lookup-and-shelves.md#d5--named-shelves-one-per-book-with-a-marked-finished-shelf) | holds |
| D6 | Covers stored on the device, pending Open Library's word | [01](01-book-lookup-and-shelves.md#d6--covers-stored-on-the-device-pending-open-librarys-word) | holds |
| D7 | Finished this year counts by an editable finished date | [01](01-book-lookup-and-shelves.md#d7--finished-this-year-counts-by-an-editable-finished-date) | holds |
| D8 | Free and non-commercial | [01](01-book-lookup-and-shelves.md#d8--free-and-non-commercial) | holds |
| D9 | The latest change wins when devices sync | [01](01-book-lookup-and-shelves.md#d9--the-latest-change-wins-when-devices-sync) | holds |
| D10 | A Svelte front end in TypeScript, built static | [architecture](architecture.md#d10--a-svelte-front-end-in-typescript-built-static) | holds |
| D11 | The server, sign-in and sync are decided by P1.2 | [architecture](architecture.md#d11--the-server-sign-in-and-sync-are-decided-by-p12) | holds |
| D12 | Hosting on Cloudflare Pages | [architecture](architecture.md#d12--hosting-on-cloudflare-pages) | holds |
| D13 | Dexie on IndexedDB for the device store | [architecture](architecture.md#d13--dexie-on-indexeddb-for-the-device-store) | holds |
| D14 | Vitest and Playwright, and the branch and pull request rules | [architecture](architecture.md#d14--vitest-and-playwright-and-the-branch-and-pull-request-rules) | replaced by D15 |
| D15 | Vitest and Playwright, with each task built on `main` | [architecture](architecture.md#d15--vitest-and-playwright-with-each-task-built-on-main) | holds |

## Change log

| Date | Change |
|---|---|
| 2026-11-05 | Added D1 to D9, from decide's first session |
| 2026-11-07 | Added D10 to D14, from the architecture |
| 2026-11-09 | Added D15, from the architecture |
