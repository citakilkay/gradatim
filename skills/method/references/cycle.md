# The cycle

*The steps of Gradatim's method in order, their loops, where unplanned work enters, and how a step tells where a project stands. Written by MTH-1 on 2026-10-28. [documents.md](documents.md) says what each step writes. The Skill column, added by MTH-2 on 2026-10-29, names the skill that runs each step.*

| # | Step | Skill | What it does | Runs | Next | Idea |
|---|---|---|---|---|---|---|
| 1 | init | `init-project` | Sets up the project's folder: git, and `AGENTS.md` with the idea, who works on it and the order of the documents. Presents the cycle, or runs the quick start | Once, first | research | 1 |
| 2 | research | `research-topics` | Researches the idea's risks, trade-offs, market and more, in cited reports. Decides nothing | After init, and any time | decide | 2 |
| 3 | decide | `decide-direction` | Asks the user about the project's direction until both agree, then records the decisions | After research, and whenever the direction changes | concept on its first run; later, the step the change affects | 3 |
| 4 | concept | `write-concept` | Writes the concept, the MVP, the roadmap and the phases, and the overview artifact | Once the decisions are final; again for a changed plan | architecture | 4 |
| 5 | architecture | `write-architecture` | Writes the architecture, the runbook and the agent docs from the user's choices of stack and structure. It designs nothing on its own | After the concept; again for a changed stack | new sprint | 5 |
| 6 | new sprint | `new-sprint` | Plans the next sprint's tasks, or adds a task to the open sprint | When no sprint is open; "add a task" any time | design task | 6 |
| 7 | design task | `design-task` | Brainstorms a task with the user and writes its design | For each task, in the board's order | build task | 7 |
| 8 | build task | `build-task` | Builds the task and makes sure it works. A problem that needs thought becomes an issue | After the task's design | close task | 8a |
| 9 | close task | `close-task` | Checks the criteria, reviews the code, updates what the task made stale, and seals the task | After the task's build | draft PR where a pull request is due; else design task for the next task, or close sprint when no task is left to do | 8b |
| 10 | draft PR | `draft-pr` | Opens a draft pull request, with an explainer when it is large | After a task's close, where a pull request is due | design task for the next task; close sprint when no task is left to do | 9a |
| 11 | close sprint | `close-sprint` | Checks the sprint's critical changes, defers what is left, brings the main documents in line, and seals the sprint | When the sprint's work is done | release when there is something to ship; else review when it is due; else new sprint | 9b |
| 12 | release | `ship-release` | Ships by the runbook, checks the release and records it. Rolls back a release that fails its check | After a sprint's close, and any time | review when it is due; else new sprint | — |
| 13 | review | `review-project` | Ranks improvements to the architecture, the UX and the features in an artifact, with badges. The user's picks become stories | Suggested after two or three sprint closes | new sprint; decide for a pick that changes the direction, architecture for one that changes the stack or the modules | 10 |
| 14 | demo | `record-demo` | Records a walkthrough of the feature the user asks for, or the whole UI | Any time the project has a UI | the step the user was on | Bonus |

The last column is the step's number in the owner's idea, which has two steps 8 and two steps 9.

## The loops

- **The task loop:** design task, build task, close task, and draft PR where a pull request is due. One task at a time, in the order of the open sprint's board.
- **The sprint loop:** new sprint, the task loops, close sprint, release, review, and new sprint again. The release runs when the sprint has something to ship, and the review when it is due.
- **Any time:**
  - research;
  - decide, for a change of direction;
  - concept, for a changed plan;
  - architecture, for a changed stack or a new agent doc;
  - release, when the user asks;
  - demo, once there is a UI.

At most one sprint is open at a time.

## Unplanned work

| What happens | Where it enters | Then |
|---|---|---|
| The user wants a change | A task's step takes it, as [the change](change.md) says; decide, a change of direction | The sync carries it down, and new sprint takes new work |
| The stack or the structure must change, or an agent doc is missing | architecture | The sync carries the change down |
| A question needs facts | research | decide, if the facts change a choice |
| A build meets a problem that needs thought, not a quick fix | build task writes an issue and goes on with what doesn't depend on it | new sprint offers the issue |
| A task's close finds work that has to wait | close task, through new sprint's "add a task" | The task loop, or deferral at the sprint's close |
| An urgent bug, or a task the user asks for | new sprint's "add a task": its place in the order, the capacity and a log row | The task loop |
| A release fails its check | release rolls it back by the runbook and records that | new sprint opens the next sprint with the fix first |
| Any of the last three while no sprint is open | new sprint opens the next sprint with that work first | The task loop |
| The user picks a review's recommendation | review adds it as a story | new sprint takes it. A pick that changes the direction goes to decide, and one that changes the stack to architecture |
| The project already has code or documents when init runs | init, which keeps every file and names the documents it found | Design task after the [quick start](quick-start.md), or the first step whose documents don't exist yet |

## Where the project stands

Read the project's state from its documents, never from memory:
- **The open sprint** is the one that `docs/sprints/README.md` lists as `open`. There is none before the first new sprint, and none between a sprint's close and the next new sprint.
- **The next task** is the first `to-do` task on the open sprint's board whose dependencies are all `completed`.
- **A task under way** is `in-progress` on the board.
- **A task built** is `in-progress`, with a row in its log that opens "Built by the build task step": close task comes next.
- **A task closed** is `completed` or `completed-as-partial`: where a pull request is due, draft PR comes next until its sprint's log has a row with its pull request's link.
- **A pull request is due** as the development cycle's Pull requests line says, under a rule that bars git writes too. With no such line, it is due for each task but one developer's task built on the base, as `AGENTS.md` and its start row say.
- **Something to ship:** a task of a closed sprint whose work users run, a setup task's too, which no release in `docs/RELEASES.md` holds yet. Release then comes before review and new sprint.
- **A review is due** once two sprints have closed after the one that the last row of the Reviews in `docs/sprints/README.md` names, or since the first sprint if no review has run. Suggest it after two closes, and again after three.
- **The steps done so far** show in which documents exist. [documents.md](documents.md) names the step that creates each.

At the end of a step, propose the next one from the Next column, read against this state. When the next step lacks a document it needs, propose the step that creates it.
