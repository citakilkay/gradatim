# The task file

*The template of a task file, `docs/sprints/sprint-<n>/<ID>-<slug>.md`, which the new sprint step creates, and which design task brainstorms. Its title, its Parent line, its header rows and its parts are fixed, since `check-sprint` and the sync read them. It has no Estimate row: the board's Days column is the one place for that number. Design task adds the Design row to the header.*

````markdown
# <CODE>-<n> · <Title>

Parent: [sprint <n>](README.md)

| | |
|---|---|
| Status | `to-do` |
| Story | <Story ids joined by ", ", or the milestone: the MVP, or phase <k>> |
| Depends on | <Task ids joined by ", ", or —> |
| Takes | <The file names of the issues or deferred items it takes, each in backticks, or —> |

## Goal

<What is true when the task is done, in one or two sentences.>

## Scope

**In**
- <What the task delivers.>

**Out**
- <What it leaves, and to which task.>

## Acceptance criteria

- [ ] <A check that can be shown to hold, copied from the story's done line, or from what a taken item or issue needs.>

## Questions for the brainstorm

1. **<The question.>** <What the story leaves open here.> Proposed: <an answer>.

## Documents to check on close

- <The documents this task is expected to make stale.>

## Log

| Date | Event |
|---|---|
| YYYY-MM-DD | Written by the new sprint step. |
````

- **The id** is the module's code and the next number in that module, across all sprints.
- **The story** is one that the task's module names. A task in a module that names no story serves a milestone, and names it: the MVP, or phase <k>.
- **Takes** copies what the task needs from each issue or deferred item, and names the file in backticks, never through a link, since the file is deleted later.
- **The questions** come with a proposed answer each. A choice that the architecture pins to the task's story comes first, naming its record, such as D11, and the task's design settles it.
- **Ids in the text** name only tasks that have files. The check reads an example id as a task with no file, even in a code span, so name none.
