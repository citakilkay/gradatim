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

