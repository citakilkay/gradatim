# The commands

*The template of `docs/agents/commands.md`, which the architecture step creates in every project. It lists what to run, and what each command does. Its table is fixed, since `check-architecture` reads the Built by column and the sync sets it. `AGENTS.md` points to it. The file keeps no log.*

````markdown
# Commands

What to run in <Project>, and what each command does. A command marked `planned` doesn't exist yet: the task that builds it sets its Built by to its id.

| Command | What it does | Built by |
|---|---|---|
| `<command>` | <what it does> | planned |
````

- **Built by** is `planned`, `existing` for a command the project's code already had, or the id of the task that built the command. The sync sets the id at that task's close.
- **The rows** are the commands the architecture and the runbook need, such as the dev server, the tests, the build and the deploy, and any command a manifest already holds.
