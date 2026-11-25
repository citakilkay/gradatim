# 01 · Scope and platform

*Decide's first session, 2026-11-04, from the research in [docs/research/](../research/README.md): which public book API Shelf uses for ISBN lookup, and the questions the idea leaves open.*

### D1 · A web app in the browser

- **Decision:** Shelf is a web app that a reader uses in the browser, on a phone or a computer.
- **Over:** a native app, which would need two builds and two stores.
- **Why:** the idea asks for a small web app, and the book API answers a browser directly (01 F15).
- **Date:** 2026-11-04.

### D2 · Open Library for ISBN lookup

- **Decision:** Shelf looks a book up by its ISBN with Open Library's Books API, called from the browser.
- **Over:** Google Books, whose keyless calls all failed, and whose quotas for a key are undocumented (02 F13, 02 F14).
- **Why:** one call gives the title, the authors and the covers (01 F2), it needs no key (01 F13), and [the comparison](../research/03-book-apis-compared.md) favours it on access.
- **Date:** 2026-11-04.

### D3 · Covers by link, never stored

- **Decision:** Shelf shows covers by linking Open Library's cover URLs by cover ID, with a courtesy link back, and keeps no copy.
- **Over:** keeping copies of the covers.
- **Why:** lookups by cover ID aren't rate-limited (01 F6), and no page grants a licence to keep the jacket art (01 F20).
- **Date:** 2026-11-04.

### D4 · Shelves that work offline

- **Decision:** in the MVP, a reader's books and shelves are kept in the browser, work offline, and catch up with Shelf's server when the reader is back online.
- **Over:** online only.
- **Why:** the idea says the shelves work offline, and catch up when the reader is back online.
- **Date:** 2026-11-04.

> **Replaced by D10, 2026-11-05.** The MVP ships online only, and the offline shelves move to phase 1 ([02](02-no-offline-in-mvp.md#d10--the-mvp-ships-online-only)).

### D5 · Sign-in by an e-mail link

- **Decision:** a reader signs in with a link sent by e-mail, and their shelves live on Shelf's server.
- **Over:** no accounts, which would keep the shelves on one device.
- **Why:** a reader's shelves should survive a new phone.
- **Date:** 2026-11-04.

### D6 · Finished this year

- **Decision:** "Finished this year" counts the books a reader moved to Finished since 1 January.
- **Over:** a reading goal, which waits for phase 1.
- **Why:** the idea asks only for the count.
- **Date:** 2026-11-04.
