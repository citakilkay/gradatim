# Shelf · The runbook

*How a release goes out, written by the architecture step on 2026-11-17, from [the architecture](ARCHITECTURE.md). A command marked planned in [the commands](agents/commands.md) doesn't exist yet.*

## Before a release

- `npm test` passes on `main`, and the working tree is clean.
- The version in `package.json` is raised and committed, tagged as `v` and the version, such as `v0.1.0`, and pushed with its tag.
- On the host, note the tag that runs now, from `git describe --tags` in the checkout, and copy the data file aside: `cp "$SHELF_DATA_DIR/shelf.json" "$SHELF_DATA_DIR/shelf.json.bak"`.
- One reader uses Shelf, so there is nobody else to tell. A release that changes the data's shape says so in its tag's message.

## A release

1. On the host, in the checkout: `git fetch --tags`, then `git checkout` the new tag.
2. `npm install`, which installs nothing while Shelf has no dependency (D10), and stays as a step for the day it has one.
3. `sudo systemctl restart shelf`, which runs `npm start` with the service's `PORT` and `SHELF_DATA_DIR`.
4. `systemctl status shelf` shows the service active, and `journalctl -u shelf -n 50` shows no error.

## The check

- On the host, `curl -s http://localhost:$PORT/books` answers with the books as JSON, the same books as before the release.
- In a browser at the host's address, the page shows the shelves, the books, and this year's count.
- Add a book named "Release check", see it on the first shelf, remove it, and see it gone. Restart the service once more, and see the books still there.

## A rollback

1. In the checkout, `git checkout` the tag noted before the release.
2. If the release changed the data's shape, stop the service with `sudo systemctl stop shelf`, and copy `shelf.json.bak` back over `shelf.json`.
3. `sudo systemctl restart shelf`, run the check above, and see `git describe --tags` name the previous tag.

## Change log

| Date | Change |
|---|---|
| 2026-11-17 | Written by the architecture step |
