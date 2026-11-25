# The architecture

*The template of `docs/ARCHITECTURE.md`, which the architecture step creates. New sprint copies its module codes into the sprint rules, design task reads its seams, and the release step reads its deployment view. Its headings and its two tables are fixed, since `check-architecture` reads them. The document is living, so each change is logged at its end.*

````markdown
# <Project> · The architecture

*The architecture step's architecture, written on YYYY-MM-DD, from [its records](decisions/architecture.md). It rests on D<n>, D<n> and D<n> ([the decisions](decisions/README.md)).*

## Overview

<What runs where and how the parts meet, in a short paragraph, citing the decisions behind it as (D<n>).>

## Modules

| Code | Module | What it holds | Stories |
|---|---|---|---|
| <ABC> | <Name> | <What the module owns> (D<n>) | <M<n>, P<k>.<n>> |

## Seams

<How the modules meet: the interface at each seam, and what crosses to a service outside.>

## Data

<What is stored, where, in what shape, and which module owns it.>

## Deployment

<Where the system runs and how it gets there (D<n>).> [The runbook](RUNBOOK.md) says how a release goes out.

## Testing

<What is tested at which level, and the gate a change passes before it merges.>

## Open choices

| Choice | Decided by | Until then | Record |
|---|---|---|---|
| <The choice> | <The story, the MVP or phase k that decides it> | <What the architecture assumes> | D<n> |

## Change log

| Date | Change |
|---|---|
| YYYY-MM-DD | Written by the architecture step |
````

- **The opening line** names every decision the architecture rests on. Each decision it cites holds, or is drafted in the records.
- **A module's code** is three capital letters, and each is the code of one module. It is never the name of a standard that a text writes with a number, such as UTF or ISO. Infrastructure work, such as the server, the sign-in or the hosting, gets a module of its own.
- **Stories** are listed by id, one by one: every planned story of the MVP sits in a module. A module with no story yet leaves the cell empty. A review adds the story of a pick it plans to its module's cell.
- **Open choices:** one row for each deferral that holds. With none, the part reads "Nothing open."
- **No task is named,** since the tasks come with the sprints. The sync logs a task's change in the change log.
- **A part of the project's own,** such as Security, Runtime or Observability, goes after Testing, only where the concept or the decisions raise it.
- **Ids and types** that the text writes as they are, such as `D<n>`, go in code spans: a `<…>` outside code reads as a slot left unfilled.
