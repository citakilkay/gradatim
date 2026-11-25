---
name: record-demo
description: "Records a short, paced video of the feature the user asks for in a Gradatim project's UI, or of the whole UI, with the project's own Playwright, and keeps its script beside the video. Use when the user asks for Gradatim's demo step, or to record, film or show a demo or a walkthrough of the app."
license: MIT
---

# Demo

The fourteenth step of Gradatim's cycle, any time the project has a UI. It records a paced video of the project's UI, a card at each beat, with the project's own Playwright, from a walkthrough it keeps beside the video, so that a later demo records it again after the UI changes. The video stays on the user's machine. Checking that a page works is the project's tests', and a pull request is draft PR's.

This skill writes only what "Reads and writes" lists, and makes only the git and GitHub writes its steps name.

**A usual run:** the task's criteria or the stories delivered, and the app's pages, read; one walkthrough written, rehearsed and recorded by this skill's script, which serves the app and stops it; the agreement on the video; and at the yes the final mark and one commit. Make routine calls yourself, and ask only where a step says, or where two readings of the request would lead to different work.

## When to use

- The user asks for Gradatim's demo step, or to record, film or show a demo or a walkthrough of the app. Draft PR starts it for a change a user sees.
- Not for checking that a page works: that is the project's tests, in `build-task` or `close-task`. Not for a review of the UI: that is `review-project`. Not for a folder with no Gradatim project: that is `init-project`.

## Reads and writes

| Document | Path | Use |
|---|---|---|
| Agent file | `AGENTS.md` | reads |
| Agent docs | `docs/agents/<topic>.md` | reads |
| MVP | `docs/MVP.md` | reads |
| Phase | `docs/PHASE-<k>.md` | reads |
| Sprint README | `docs/sprints/sprint-<n>/README.md` | reads |
| Task file | `docs/sprints/sprint-<n>/<ID>-<slug>.md` | reads |
| Demo walkthrough | `docs/demos/YYYY-MM-DD-<topic>.mjs` | reads, creates |
| Demo | `docs/demos/YYYY-MM-DD-<topic>.webm` | creates |

Of the project's own files, it changes only `.gitignore`, with the line `docs/demos/*.webm`, where git doesn't ignore the videos yet. It serves the app only through its script, installs nothing, writes no `CLAUDE.md`, runs no sync, and changes nothing sealed: a later run records a new pair.

## Steps

1. **Start.** Open each reply with the line `**Gradatim · demo**`, the reply to the user's last answer too, with what you found below it. Read the map of the host you run in, `../method/references/host-<host>.md`: if it says Gradatim is made for another model than yours, say so once, above the heading, as it words it. If `AGENTS.md` has no line "The documents flow top-down: …", this folder holds no Gradatim project: stop, as "Stop" says. Stop too where the code serves no page yet. If the user didn't ask for this step, as with a question on what a page looks like, answer what they did say, then say in a line what it would record and write, and wait for the yes.
   - **Ready:** run `node <this skill's folder>/scripts/demo.mjs ready <the project's folder>`. Where it prints "not ready", install nothing, and ask in plain text, ending your reply:

     ```
     <Project> has no Playwright 1.64 or later ready in its packages, which records the video, and I install nothing.
     1. Set it up yourself, then ask again (Recommended): <the commands it printed>
     2. Record it by hand: numbered steps for your own screen recorder
     ```

     On 1, stop, as "Stop" says. On 2, write nothing: give numbered steps, each with what to show and how long to hold it, then go to Next step.
   - **Its drafts:** a walkthrough in `docs/demos/` whose first line is `// Gradatim demo: draft` is a stopped run's. Ask, with its name, whether to go on from it (Recommended), since its beats are written, or start over, and end your reply.
   - **What it shows:** the criteria of the task the user names, or of the one draft PR started this step for; else of the task closed last, by its sprint's log; else the stories the closed sprints delivered. The user's own words win. Ask nothing else before the recording.
   - **Git:** read the user's rules about git, in `AGENTS.md`, `docs/agents/development-cycle.md` and their own words. A rule of theirs that bars git writes makes the commit theirs.

   [The capabilities](../method/references/capabilities.md), [the contract](../method/references/contract.md) and [the documents](../method/references/documents.md) hold the details: read one when a step needs it. Done when Playwright is ready, and what the demo shows is known.
2. **Write.** The walkthrough, from [the template](assets/walkthrough.mjs):
   - Where `git check-ignore -v docs/demos/x.webm` prints nothing, add the line `docs/demos/*.webm` to `.gitignore`, creating it where there is none.
   - Name it `docs/demos/YYYY-MM-DD-<topic>.mjs`: today's date, and a topic of one to three lower-case words that no demo holds. To record a topic again after a change, copy its final walkthrough under today's date, with the draft mark, and fix what moved: the old pair stays as it is.
   - Fill `app` from the commands doc, or from the browser tests' own server: the command that serves the production build first, else the dev server, and its address. `size` stays 1280 by 720, or a phone's, such as 390 by 844, where the user asks.
   - Run `node <this skill's folder>/scripts/demo.mjs discover <the walkthrough> [<path> …]`, each path without its leading slash, such as `add`, and `.` for the home page. It serves the app and prints each page's tree.
   - Write the beats in this order: entry, context, action, variation, result, each opening with its card: a title under 40 characters, and one line under 60 on what the viewer sees, with no caption besides; in about 90 seconds at most. Use only locators that discover printed, a select by its label, one tab, and a sign-in only with an account the user gave for the demo.

   Done when the walkthrough holds no slot of the template.
3. **Rehearse.** Run `node <this skill's folder>/scripts/demo.mjs rehearse <the walkthrough>`. A fault names the walkthrough's line and prints what the page shows: fix the walkthrough, never the app, and run it again. Done when it prints "rehearsed: no fault".
4. **Record.** Run `node <this skill's folder>/scripts/demo.mjs record <the walkthrough>`. It serves the app, rehearses, records, stops the app, and prints the video's length, size, chapters, timeline and pace. It takes about a minute more than the demo, so give the command a timeout of five minutes. A fault is fixed as in Rehearse. Where its last line says the address still answers, tell the user. Done when it prints "recorded".
5. **Agree.** Show the summary in one reply, in this shape:

   ```
   **The video:** `docs/demos/<file>.webm`, <m:ss>, <size> MB, <width> by <height>: on this machine only, since git ignores it. Open it in a browser to watch it.
   **Its chapters:** <m:ss> <title> · …
   **The walkthrough:** `docs/demos/<file>.mjs`, drawn from <the task's criteria | the stories delivered | your words>: a later demo records it again after the UI changes.
   **What the yes writes:** its first line, `// Gradatim demo: final, YYYY-MM-DD`; then one commit, "<message>", of the walkthrough<, `.gitignore`><, and the final documents no commit holds yet>. Under your git rule: no commit, and the commands for you.
   ```

   Then ask in plain text, since a dialog would cover the summary, and end your reply:

   ```
   Are you satisfied with this, and do we agree on it?
   1. Yes, it's final
   2. Not yet: say what to change
   ```

   On "Not yet", change the walkthrough, rehearse and record it again over the draft, show what changed, and ask again. On the yes, and only then, in this order:
   1. **The final mark:** the walkthrough's first line becomes `// Gradatim demo: final, YYYY-MM-DD`, with today's date. Then run `node <this skill's folder>/scripts/check-demo.mjs <the project's folder>` until it ends with "0 faults".
   2. **The commit:** `git add` each path by name: the walkthrough, `.gitignore` where you changed it, and the final Gradatim documents no commit holds yet, never the video. Then `git commit -m "<one or two sentences>"`. Under a rule of the user's that bars git writes, run none: show the commands as theirs.

   Done when the mark is written, and the commit made or shown.
6. **Next step.** The step the user was on: the one that started this step, such as draft PR, which then finds the demo. Else take the next step from [the cycle](../method/references/cycle.md)'s Next column and the project's state. Offer only a skill whose `../<skill>/SKILL.md` exists, or say it isn't installed, with no option. End with:

   ```
   **Demo: done.**
   **Recorded:** `docs/demos/<file>.webm`, <m:ss>, <size> MB: <the chapters>.
   **Written:** `docs/demos/<file>.mjs`, final<; `.gitignore`'s line `docs/demos/*.webm`>.
   **Git:** the commit "<message>" | under your rule, the commands to run.
   **The video** stays on this machine, out of git: drag it into a pull request's description on GitHub, where it plays, up to 10 MB on a free plan.
   **Next:** <the step you were on>, with `<skill>`: <why>.
   1. Start `<skill>` now (Recommended)
   2. Stop here
   ```

   Start it only at the user's word. Done when the user chose.

## Stop

- In each case below, reply:

  ```
  **Gradatim · demo**

  **Demo: stopped.** <The reason>: <what you found>. <Nothing was written. | The draft stays: `docs/demos/<file>.mjs`, which a later run goes on from.>
  **Next:** <the step that clears it>, with `<skill>`: <why>.
  1. Start `<skill>` now (Recommended)
  2. Stop here
  ```

  | Case | Next |
  |---|---|
  | `AGENTS.md` has no line "The documents flow top-down: …" | init, with `init-project`: it sets the project up |
  | The code serves no page yet | the cycle's next step for the project's state |
  | The user sets Playwright up themselves | none: the commands are given, and the demo runs once they ran, so the reply has no option |
  | The user stops at the agreement | the step they were on, else the cycle's next step; the draft stays |

In each, offer only a skill whose `../<skill>/SKILL.md` exists, or say it isn't installed, with no option.
