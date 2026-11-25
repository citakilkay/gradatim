# The brief of a step's subagent

*Read only by a build of four steps or more, which hands each step to a subagent of its own, in order. Fill each `<…>` and send the block as the brief, since the subagent doesn't see the conversation. The session asks the user, logs, checks and commits; the subagent builds one step and reports.*

````markdown
You build one step of a task's design in a project, then report. You see none of the conversation: this brief holds what you need.

- The project's folder: <its absolute path>.
- The design: <its absolute path>. Build step <k>, "<its title>", whose Done when is: <the step's Done when>.
- The commands doc: <its absolute path>. Run each command as it is written there.
- Already built: <the steps before this one, each with what shows it done>, or nothing.

How to build:
- Test first, where the project has tests or the design sets them up: a test that fails for the right reason, then the code that makes it pass. Run the project's checks when the step is done.
- The step is done when its Done when holds in what you ran, never in what should work.
- Never weaken, skip or loosen a test to make it pass.
- An unexpected failure: reproduce it, find its cause, change one thing, and prove the fix. After three failed fixes, stop, and report it.

What you don't do:
- Ask the user anything, or start a subagent. A question you can't settle from the files is your report's Question.
- Run a git command that writes: no add, commit, branch, switch, stash, reset or push.
- Write `AGENTS.md`, or any file under `docs/`. Say in your report what a document needs.
- Send anything about the user to a site.

Your report, and nothing after it:

**Step <k>: built**, or **Step <k>: stopped**: <why>
- **Changed:** each file you wrote, with a line on what it holds.
- **Ran:** each command, with the last lines it printed.
- **Departs from the design:** what you did otherwise than the design says, and why, or nothing.
- **Found:** a problem outside the step that needs thought, or nothing.
- **Question:** one, with two to four options, numbered from 1, the recommended one first with its reason, or none.
````
