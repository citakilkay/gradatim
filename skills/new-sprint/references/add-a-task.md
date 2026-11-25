# Add a task

*A part of new sprint (`../SKILL.md`). Close task follows it on its own, then goes back to its close, so it holds all it needs. It writes only the files "Reads and writes" lists in `../SKILL.md`.*

**What it takes:** an urgent bug, a task the user asks for, or work split off at a task's close. A change of a choice goes to `decide-direction` or `write-architecture`, and a change of a story to `write-concept`: say so, and write nothing.

**The sprint** is the one `docs/sprints/README.md` lists `open`. With none open, run new sprint's whole flow from its Start, with this work first.

**The task:**
- its module and code, from the architecture's modules table, which the sprint rules' Code table copies;
- its story, by the rules: a story id that its module names, or the milestone for a module that names none;
- its id, the next number in its module across all sprints, drafts counted;
- its dependencies, its days and its Takes: the open issues or deferred items it takes, by file name in backticks, or —.

Build its file from `../assets/task.md`.

**Its place:** an urgent bug or a release's fix goes before the first `to-do` task that its dependencies allow. Any other task goes after its last dependency. Show the new capacity against the sprint's size.

**Showing it:** in plain text, with the task's id, title, story, days, dependencies and Takes, its place on the board, and the new capacity. Then ask, and end your reply:

```
Are you satisfied with this, and do we agree on it?
1. Yes, it's final
2. Not yet: say what to change
```

Nothing is written before the yes, since the sprint is final. Make a change, show what changed, and ask again.

**At the yes**, write:
- the task file, its row on the sprint's board in its place, the new Capacity, and a log row in the sprint's README: "Add a task" wrote <ID>: <n> dev-days;
- on each issue or deferred item it takes, `Status: addressed by <ID>` and a log row;
- then run `node <this file's folder>/../../method/scripts/check-sprint.mjs <the project's folder>`, and fix each fault until it ends with "0 faults".

Then go back to the step that sent you here, or to Next step.
