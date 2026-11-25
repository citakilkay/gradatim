# The architecture's records

*The stack and the structure, as the architecture step agreed them with the user. Each run adds a dated section.*

## 2026-11-04

### D7 · A static front end with IndexedDB

- **Decision:** the front end is static TypeScript, built with Vite. It keeps the reader's books and shelves in IndexedDB, so they work offline (D4).
- **Over:** a server-rendered app, which can't work offline.
- **Why:** D1 and D4.
- **Date:** 2026-11-04.

### D8 · A small Node server with SQLite

- **Decision:** a small Node server holds each reader's shelves in SQLite, sends the sign-in links (D5), and takes the changes made offline.
- **Over:** a hosted database service, which costs more for one small app.
- **Why:** one reader at a time, and few writes.
- **Date:** 2026-11-04.

### D9 · One small virtual machine

- **Decision:** Shelf runs on one small virtual machine, deployed by the runbook's script.
- **Over:** a platform service, which costs more at this size.
- **Why:** the cheapest way to run one server and one SQLite file.
- **Date:** 2026-11-04.
