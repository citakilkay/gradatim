# An issue

*The template of an issue, `docs/issues/YYYY-MM-DD-<ID>-<topic>.md`: the day the build found it, the id of the task whose build found it, and a short topic. The build task step writes it for a problem that needs thought, not a quick fix, and names it in the task's log by its file name, in backticks, never a link, since the file is deleted once a later task completes it. Its `Status:` line and its log are fixed, since new sprint and the sprints' check read them.*

````markdown
Status: open

# <What happens, in a line>

*Found in <ID>'s build, YYYY-MM-DD.*

## What happened

<What the build saw, and what shows it: the command, the test or the page, and what it printed.>

## What it needs

<Why it needs thought rather than a quick fix, and what the build did without it.>

## Log

| Date | Event |
|---|---|
| YYYY-MM-DD | Written by <ID>'s build: `open`. |
````

- **The file name** gives the task's id, which has a file: the sprints' check holds it.
- **What it needs** is the problem, not a design: the task that takes the issue designs it.
- **One issue, one problem.** A second problem gets a file of its own.
