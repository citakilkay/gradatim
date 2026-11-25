---
name: draft-pr
description: "Opens a draft pull request for a closed task of a Gradatim project: a description, and an explainer page when the change is large. Use when the user asks for Gradatim's draft PR step, or to open, draft or create a pull request for finished work."
license: MIT
---

# Draft PR

The tenth step of Gradatim's cycle, and the last of the task loop. For a closed task whose pull request is due, it writes the pull request's description, and an explainer page when the change is large, pushes the task's branch, opens a draft pull request, and, once the user agrees, links it in the sprint's log. The review is close task's, the merge is the user's, and the release is release's.

This skill writes only what "Reads and writes" lists, and makes only the git and GitHub writes its steps name.

**A usual run:** the closed task, its design and its commits, read; a question on a demo, for a change a user sees with none; the description, and an explainer by the kit when the pull request is large; one push and the draft; the agreement, on the open draft; and at the yes the sprint's row. Make routine calls yourself, and ask only where a step says, or where two readings of the request would lead to different work.

## When to use

- The user asks for Gradatim's draft PR step, or to open, draft or create a pull request for a closed task's work.
- Not for a task that isn't closed: that is `close-task`, or `build-task` where it isn't built. Not for a review of the code: that is `close-task`. Not for merging the pull request, which is the user's, nor for shipping: that is `ship-release`. Not for the sprint's close: that is `close-sprint`. Not for recording a demo: that is `record-demo`, which this step offers for a change a user sees. Not for a folder with no Gradatim project: that is `init-project`.

## Reads and writes

| Document | Path | Use |
|---|---|---|
| Agent file | `AGENTS.md` | reads |
| Agent docs | `docs/agents/<topic>.md` | reads |
| Architecture | `docs/ARCHITECTURE.md` | reads |
| Sprint rules and index | `docs/sprints/README.md` | reads |
| Sprint README | `docs/sprints/sprint-<n>/README.md` | reads, changes |
| Task file | `docs/sprints/sprint-<n>/<ID>-<slug>.md` | reads |
| Design | `docs/plans/<ID>-<slug>-design.md` | reads |
| PR explainer | `docs/artifacts/NN-pr-<topic>.html` | creates, changes |
| Demo walkthrough | `docs/demos/YYYY-MM-DD-<topic>.mjs` | reads |
| Demo | `docs/demos/YYYY-MM-DD-<topic>.webm` | reads |

It also reads the task's commits and their diff, and the project's own pull request template, where it has one. The explainer is a file in the project only where the host can't publish it, or a rule of the user's bars that. It writes none of the project's own files, and no `CLAUDE.md`.

## Steps

1. **Start.** Open each reply with the line `**Gradatim · draft PR**`, with what you found below it. Read the map of the host you run in, `../method/references/host-<host>.md`: if it says Gradatim is made for another model than yours, say so once, above the heading, as it words it. If `AGENTS.md` has no line "The documents flow top-down: …", this folder holds no Gradatim project: stop, as "Stop" says. If the user didn't ask for this step, as with a remark on where a closed task's work is, answer what they did say, then say in a line what the step would do, its push, its draft and its page among it, and wait for the yes. The open sprint is the one `docs/sprints/README.md` lists `open`; with none, stop.
   - **The task** is the one the user names, else the first closed task on the board, `completed` or `completed-as-partial`, for which a pull request is due, as [the cycle](../method/references/cycle.md) says, and whose pull request the sprint's log doesn't link yet. Its pull request also closes each other closed task whose commits its branch holds and the base lacks, where the log links none for it. Stop, as "Stop" says, on a task that isn't closed, and where no pull request is left to open.
   - **Rules:** read the user's rules about git and about publishing, in `AGENTS.md`, `docs/agents/development-cycle.md` and their own words. A rule of theirs wins: one that bars git writes leaves the commands to them, as "By hand" says, and one against publishing keeps the explainer in the project.
   - **The remote:** `git remote`. With none, stop, before any `git switch`.
   - **The branch** is the one the task's "Build started" row names, else the one HEAD is on; where HEAD isn't on it, `git switch <branch>`. **The base** is the one the development cycle's Pull requests line names. Where the branch also holds another task's work that the base lacks, since that task's pull request isn't merged, the base is that task's branch. Read the remote with `git ls-remote --heads origin`, which changes nothing where a fetch would. Stop where the remote lacks the base, or the branch holds no commit that the base lacks.
   - **GitHub's CLI:** `gh pr list --head <branch> --json url,isDraft,baseRefName` tells whether it serves, and whether the branch has a pull request open. Where a run that stopped left one open, open no second one: go on from it at Agree. Where the command fails, since GitHub's CLI isn't installed or logged in, or the remote isn't GitHub's, the step goes by hand, as Open says.

   [The capabilities](../method/references/capabilities.md), [the contract](../method/references/contract.md) and [the documents](../method/references/documents.md) hold the details: read one when a step needs it. Done when the task, its branch and its base are known, and nothing stops the run.
2. **Read.** Read the task file, with its criteria's ticks, its evidence row and its closing row; its design's idea, its decisions and its Watch for; the commits and what they changed, `git log --oneline <base>..HEAD` and `git diff --stat <base>...HEAD`; and the project's own pull request template, where it has one. Done when you can say what the pull request does and why, what shows it, and what could go wrong.
3. **Demo.** Ask only where `../record-demo/SKILL.md` exists, a criterion of a task the pull request closes says what a user sees on a page, as "The footer of every page shows …" does, and no walkthrough in `docs/demos/` whose first line says final is dated on or after that task's start row. A draft that a stopped run left open skips this step. Ask in plain text, and end your reply:

   ```
   <ID> changes what a user sees, and the branch holds no demo.
   1. Open the draft now (Recommended): the review needn't wait for a video
   2. Record a demo first, with `record-demo`
   ```

   On 2, start `record-demo`, as the capabilities say: it ends by offering this step again, which then finds the demo. Done when the user chose 1, or no question was due.
4. **Draft.** Choose the form, make the explainer where the form has one, and write the description.
   - **The form:** a description alone, or a description with an explainer. A pull request gets an explainer when it closes more than one task, touches more than one of the architecture's modules, or its tasks come to a dev-day or more on the sprint's board. A line that only wires another module's part in, such as a component placed in the app's layout, doesn't count as touching that module. You may go the other way, with your reason in a line.
   - **The explainer,** by [the kit](../method/references/artifacts.md), named `NN-pr-<topic>.html`. Where your host's map says it can publish, and no rule of the user's bars it, write it outside the project, in your host's scratch or temp folder, wrap it, and publish it at once, with no question. Else, or if the publish fails, write it in `docs/artifacts/` and wrap it there. Its masthead gives the branch and the base, since the pull request has no address yet.
   - **The description,** in this shape. Its first line is the pull request's title, with no `$`, `%`, `!`, backtick or double quote, since it goes on a command line. The rest goes to GitHub's CLI through a file: write it outside the project, in your host's scratch or temp folder, so that the project keeps no copy.

     ```
     <ID>: <what it does, in a few words>

     ## What and why
     <What changes, and why now, in a short paragraph.>

     ## Tasks
     - <ID> · <title>, `<status>`: <what it built>. `<the task file's path>`, `<the design's path>`. <A criterion moved, with where it went.>

     ## What to check
     <Where to start. What was run and seen at the close, by its command. "Not tested: <what, and why>" where that is true. A before and an after for a change a user sees, and its demo where the branch holds one: the walkthrough's path, and the video's file name, which its author drags in here.>

     ## Risks
     <What could go wrong, and what guards it; whether it is easy to undo; each finding the review left.>

     ## Explainer
     <The page's address; or `docs/artifacts/NN-pr-<topic>.html` on this branch, to download and open in a browser.>
     ```

     Write it for a reviewer who hasn't worked in this part of the code. Name a document by its path in a code span, report only what ran, and drop "Explainer" where there is none. On a stacked branch it opens "Stacked on <its link>: merge that one first." Where the project has a pull request template of its own, fill that, with these parts in it.

   Done when the description is written, and the explainer is wrapped with "no fault", and published where it can be.
5. **Open.** With no question before it but the demo's: the user asked for the pull request, and the agreement comes on the open draft, where "Not yet" still changes it. Run these, the first two only where the project keeps the explainer:

   ```
   git add docs/artifacts/NN-pr-<topic>.html
   git commit -m "<one or two sentences>"
   git push -u origin <branch>
   gh pr create --draft --base <base> --head <branch> --title "<title>" --body-file "<the file>"
   ```

   The commit's message has no description, and no `$`, `%`, `!`, backticks or double quotes. Leave `--draft` out only where the project's Pull requests line says so. If a command fails, show what it printed, and stop.

   **By hand,** where GitHub's CLI doesn't serve, or a rule of the user's bars git writes: run the commands the rule allows, and give the rest in one reply: each command you didn't run; where to open the pull request, with its base and its branch; the title and the description, each in a code block; and the explainer's address or path. Ask for the pull request's link in plain text, with no options, and end your reply.

   Done when the draft is open, and its link is known.
6. **Agree.** Show the summary in three parts:
   - **The pull request:** its link, a draft from the branch into the base, with its title and its description as sent;
   - **The form:** a description alone or with an explainer, and why, with the explainer's address or path;
   - **What the yes writes:** the sprint's row, which no commit holds until the next step's.

   Then ask in plain text, since a dialog would cover the summary, and end your reply:

   ```
   Are you satisfied with this, and do we agree on it?
   1. Yes, it's final
   2. Not yet: say what to change
   ```

   On "Not yet", change the open draft, with `gh pr edit <link> --title "<title>" --body-file "<the file>"`, or by hand give the changed text to paste again. A changed explainer is published again at its address, or changed in its file, wrapped, committed and pushed. Show what changed, and ask again. On the yes, and only then, add this row at the end of the sprint's log:

   ```
   | YYYY-MM-DD | <ID>'s pull request, from `<branch>` into `<base>`, linked by the draft PR step: <link> |
   ```

   Make no commit and no push for the row: it rides with the next step's commit, so that the pull request's checks don't run a second time. Done when the row is written.
7. **Next step.** Take the next step from [the cycle](../method/references/cycle.md)'s Next column and the project's state: design task for the next task, or close sprint when no task is left to do. End with:

   ```
   **Draft PR: done.**
   **Opened:** <the link>, a draft from `<branch>` into `<base>`, for <the task or tasks>.
   **Explainer:** <the page's address, or the file's path>, or none: <why>.
   <Where the branch holds a demo: **Demo:** `docs/demos/<file>.webm`, on your machine only: drag it into the pull request's description on GitHub, where it plays.>
   **Written:** the row in <the sprint's README, linked>. No commit holds it yet: the next step's takes it.
   **Git:** `<branch>` pushed, with the commit "<its message>" where there is one; or, under the user's rule, the commands to run.
   **Open:** to look the draft over, mark it ready, and merge it as the development cycle's Pull requests line says, before the next task's build where you can, since later branches stand on it. <On a team's project, with a published page: to open the page and share it with the team, since only you see it until then.>
   **Next:** <design task or close sprint>, with `<its skill>`, for <its task or the sprint>: <why>.
   1. Start `<its skill>` now (Recommended)
   2. Stop here
   ```

   Offer only a skill whose `../<skill>/SKILL.md` exists, or say it isn't installed, with no option. Start it only at the user's word. Done when the user chose, or you said it isn't installed.

## Stop

- If `AGENTS.md` has no line "The documents flow top-down: …", write nothing, and reply:

  ```
  **Gradatim · draft PR**

  **Draft PR: stopped.** This folder holds no Gradatim project: <what you found>. Nothing was written.
  **Next:** init, with `init-project`: it sets the project up.
  1. Start `init-project` now (Recommended)
  2. Stop here
  ```
- If no sprint is open, write nothing, and reply:

  ```
  **Gradatim · draft PR**

  **Draft PR: stopped.** No sprint is open: <what you found>. Nothing was written.
  **Next:** new sprint, with `new-sprint`: it plans the next sprint's tasks.
  1. Start `new-sprint` now (Recommended)
  2. Stop here
  ```
- If the task isn't closed, write nothing, and reply, with build task and `build-task` where its log has no row that opens "Built by the build task step":

  ```
  **Gradatim · draft PR**

  **Draft PR: stopped.** <The task> isn't closed: <its status and its last row>. Nothing was written or pushed.
  **Next:** close task, with `close-task`: a pull request is for work that is checked, reviewed and sealed.
  1. Start `close-task` now (Recommended)
  2. Stop here
  ```
- If no pull request is left to open, write nothing, and reply:

  ```
  **Gradatim · draft PR**

  **Draft PR: stopped.** No pull request is left to open: <each closed task, with why: its pull request's link in the sprint's log; built on the base, with no branch of its own; or the project's rule>. Nothing was written or pushed.
  **Next:** <design task or close sprint>, with `<its skill>`, for <its task or the sprint>: <why>.
  1. Start `<its skill>` now (Recommended)
  2. Stop here
  ```
- If no pull request can be opened, since the project has no remote, the remote lacks the base, or the branch holds no commit that the base lacks, write nothing, and reply, with no option:

  ```
  **Gradatim · draft PR**

  **Draft PR: stopped.** No pull request can be opened: <what you found>. Nothing was written or pushed.
  **Next:** <what clears it, such as the command that adds the remote, or a first push of the base>, then draft PR again.
  ```

In each, offer only a skill whose `../<skill>/SKILL.md` exists, or say it isn't installed, with no option.
