# A deferred item

*The template of a deferred item, `docs/deferred-items/YYYY-MM-DD-<origin>-<topic>.md`: the day of the sprint's close, the origin and a short topic. The origin is the id of the task the close deferred, or `sprint-<n>` for work that the close's own check deferred. The close sprint step writes it at the yes, and names it in the task's log and the sprint's closing row by its file name, in backticks, never a link, since the file is deleted once a later task completes it. Its `Status:` line and its log are fixed, since new sprint and the sprints' check read them.*

````markdown
Status: open

# <What it carries, in a line>

*Deferred at sprint <n>'s close, YYYY-MM-DD. It came from <ID>.*

## What it still needs

<The parts still needed, each with the story, the criterion or the decision behind it: what a later task must build or settle, and what is done already, so that nothing is built twice.>

## Log

| Date | Event |
|---|---|
| YYYY-MM-DD | Written by sprint <n>'s close: `open`. |
````

- **One item for a task:** it carries the parts the task still needs, not a copy of the task. The task's file keeps the rest, sealed.
- **From the check,** the opening line ends "It came from the close's check: <the change, with its task>." instead.
- **The file name** gives a task's id, which has a file, or the sprint's, `sprint-<n>`: the sprints' check holds it.
