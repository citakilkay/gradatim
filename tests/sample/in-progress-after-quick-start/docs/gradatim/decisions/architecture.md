# The architecture's records

*The stack and the structure, as the architecture step agreed them with the user. Each run adds a dated section.*

## 2026-11-18

### D3 · Node's own http module, one ES module file, no framework

- **Decision:** Shelf runs on Node with its own `node:http` module and no framework, as ES modules in `src/`; the server, the page and the routes sit in `src/shelf.js`.
- **Over:** a web framework such as Express, which one page and a few routes don't need, and which adds a dependency that `AGENTS.md` asks about first.
- **Why:** found in the code, and in the project's own `docs/decisions/README.md` and `AGENTS.md` (01 F3, 01 F4).
- **Date:** 2026-11-18.

### D4 · Where the books are kept is decided by M4

- **Decision:** Where the books and their shelves are kept is decided by M4. Until then, the architecture assumes they live in memory in `src/shelf.js`, and a restart loses them; the project's own `docs/sprints/sprint-2/STO-1-books-in-a-file.md` proposes one JSON file beside the app.
- **Over:** choosing the file's shape now, before the task that builds it is designed.
- **Why:** found in the code for the memory (01 F7); nothing settles the file's shape, so chosen for the user.
- **Date:** 2026-11-18.

### D5 · Node's own test runner

- **Decision:** the tests run with Node's own runner, `node --test`, as `npm test`.
- **Over:** a test framework such as Jest or Vitest, which adds a dependency.
- **Why:** found in the code, in `package.json` (01 F5).
- **Date:** 2026-11-18.

### D6 · Where Shelf is hosted is decided by the MVP

- **Decision:** Where Shelf is hosted is decided by the MVP. Until then, the architecture assumes it runs on the reader's own machine with `npm start`, on port 3000.
- **Over:** choosing a host now, with nothing in the project that asks for one.
- **Why:** nothing in the code or the project's documents names a host (01 F5), so chosen for the user.
- **Date:** 2026-11-18.
