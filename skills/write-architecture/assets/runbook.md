# The runbook

*The template of `docs/RUNBOOK.md`, which the architecture step creates from the deployment view. The release step follows its parts in this order and adds what each release taught. Its headings are fixed, since `check-architecture` reads them. The document is living, so each change is logged at its end.*

````markdown
# <Project> · The runbook

*How a release goes out, written by the architecture step on YYYY-MM-DD, from [the architecture](ARCHITECTURE.md). A command marked planned in [the commands](agents/commands.md) doesn't exist yet.*

## Before a release

<What must be true first: the checks that pass, the version to bump, and anything to tell users.>

## A release

<The steps in order, each a command or an action. Name a command as the commands list it.>

## The check

<How to tell that the release works: the production address, or the command that shows it; what to open or run there, and what it shows.>

## A rollback

<How to go back to the previous release, and how to check that it is back.>

## Change log

| Date | Change |
|---|---|
| YYYY-MM-DD | Written by the architecture step |
````

- **A command that doesn't exist yet** is still named, marked planned in the commands, with what it will do, so that the release step can follow the runbook before the task that builds it.
- **A project with no deployment yet** (a library, a script) says in each part what applies, such as publishing a package, and does not leave a part out.
