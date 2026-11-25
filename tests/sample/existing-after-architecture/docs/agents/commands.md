# Commands

What to run in Shelf, and what each command does. A command marked `planned` doesn't exist yet: the task that builds it sets its Built by to its id.

| Command | What it does | Built by |
|---|---|---|
| `npm install` | Installs the dependencies, of which there are none yet | existing |
| `npm start` | Starts the server, on `PORT` or 3000; with the store, it keeps the data in `SHELF_DATA_DIR` or `data/` | existing |
| `npm test` | Runs every test with Node's own runner, `node --test` | existing |
| `sudo systemctl restart shelf` | On the host, restarts Shelf's service after a release or a rollback, once its unit is written | planned |
