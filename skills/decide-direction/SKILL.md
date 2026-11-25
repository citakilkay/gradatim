---
name: decide-direction
description: "Grills the user on a Gradatim project's open choices, from its idea and research, and records each decision. Use when the user asks for Gradatim's decide step, to settle what the research left open or be grilled on it, or to change the project's direction."
license: MIT
---

# Decide direction

The third step of Gradatim's cycle, and the one that runs again whenever the direction changes. It grills the user on the choices the idea and the research leave open, until nothing is blurry, records each decision under `docs/decisions/`, and, after the yes, has the sync bring the documents in line. Finding facts is the research step's job; the stack and the structure are the architecture step's.

This skill writes only what "Reads and writes" lists, and makes only the git and GitHub writes its steps name.

**A usual run:** the idea and the research read; two to five rounds of up to four questions, drafted as you go; the agreement; on a change, one search for what it reaches, and the sync in a subagent. Fewer rounds for a small change. Make routine calls yourself, and ask only where a step says, or where two readings of the request would lead to different work.

## When to use

- The user asks for Gradatim's decide step, or to settle what the research left open, or to be grilled on it.
- The user wants to change the project's direction: who it is for, what it is, or more of the MVP's cut than a story or two. A review's pick that changes the direction comes here too.
- Not for facts: that is `research-topics`. Not for the stack or the structure: that is `write-architecture`. Not for writing the concept, the MVP and the phases: that is `write-concept`. Not for a folder with no Gradatim project: that is `init-project`.

## Reads and writes

| Document | Path | Use |
|---|---|---|
| Agent file | `AGENTS.md` | reads |
| Concept | `docs/MAIN_CONCEPT.md` | reads |
| Research index | `docs/research/README.md` | reads |
| Research report | `docs/research/NN-<topic>.md` | reads |
| Decisions index | `docs/decisions/README.md` | reads, creates, changes |
| Decision session | `docs/decisions/NN-<topic>.md` | reads, creates, changes |
| Architecture's records | `docs/decisions/architecture.md` | reads, changes |
| Review report | `docs/artifacts/NN-review-sprint-<n>.html` | reads |

On a change, it also reads what its search for the change's reach finds. In the architecture's records it adds only a forward note. [The sync](../method/references/sync.md) changes what its own table lists. It writes nothing to git.

## Steps

1. **Start.** Open each reply with the line `**Gradatim · decide**`, the reply to the user's last answer too, with what you found below it. Read the map of the host you run in, `../method/references/host-<host>.md`: if it says Gradatim is made for another model than yours, say so once, above the heading, as it words it. If `AGENTS.md` has no line "The documents flow top-down: …", this folder holds no Gradatim project: stop, as "Stop" says. If the user didn't ask for this step, as with a remark on one of the choices, answer what they did say, then say in a line that it would grill them on the open choices and record the decisions under `docs/decisions/`, and wait for the yes. If there is no research index, name research as the step that makes it, and offer `research-topics` (recommended) or going on from the idea alone, which you do only at the user's word. A session file in `docs/decisions/` that the index doesn't list is a draft that a stopped run left: ask first, as a question of its own, whether to go on from it or to start over. [The capabilities](../method/references/capabilities.md), [the contract](../method/references/contract.md) and [the documents](../method/references/documents.md) hold the details: read one when a step needs it. Done when the inputs are there, or the user chose to go on without one.
2. **Open areas.** Read the idea, in `docs/MAIN_CONCEPT.md` once `AGENTS.md` links it, else in `AGENTS.md`; the reports the research index lists, none whose row says "Replaced by"; and the decisions index, with the records that hold. A concept that `AGENTS.md` doesn't link is a draft that a stopped run left: say so in a line, and take it as no concept yet. Then list the choices still open, each with where it comes from:
   - the idea, and what it leaves blank;
   - each report's `## The options`, its `## Risks, watch-outs and trade-offs` and its `## Gaps`, and a comparison's table of the ideas side by side;
   - a quote marked unverified, or a finding on one source, where a choice would rest on it;
   - the report on the code, `NN-the-code.md`: each thing it finds half built, to finish, change or drop. What the code does is settled by the report, and asked about only where the idea goes against it;
   - on a later run, the decisions the user's new direction touches, the deferrals whose time has come, and the reports newer than the last session;
   - for a review's pick, its item in the last review report, with the decision it reopens.

   Leave out what a record that holds settles, unless the new direction touches it. The stack and the structure are the architecture step's: name them for it, and don't ask. Name the areas in one line above the first round, with no recommendations, so the user can add one the documents missed. Done when each area has its source.
3. **Grill.** Ask in rounds. A round holds the open questions whose answers don't wait on another open answer, at most four, the most consequential first; one that hangs on an open answer waits for the next round. Each question opens with `**Q<k> · <title>**`, never as an item of a numbered list. Then two to five lines on what the documents say, citing findings as `NN Fk` and decisions as `D<n>`, and what the answer changes. Then its two to four options, numbered from 1, the recommended one first, with its reason. Where your question tool takes several questions, ask the round in one call, each question standing alone; without one, or when it comes back without an answer, ask in plain text, and end your reply after the last question's options, with nothing after them. Then:
   - "take your recommendations" takes them for each question asked or still to come, as the user's choice;
   - "not now" is a deferral: propose when the area is decided and what the plan assumes until then, and record it as a decision once the user agrees;
   - an answer against a record that holds is flagged once, with the record's id;
   - a question that needs facts nobody has: write the drafts, and offer `research-topics` with the question, a decision without the facts, or a deferral.

   After each round, write the drafts, as "Record" says, and ask the next round. Done when every area is decided, deferrals included: the concept step could write the concept, the MVP and the phases from the idea and the decisions without asking anything.
4. **Impact.** Only where `AGENTS.md` links the concept, since only then does the yes reach other documents. As soon as you know what the change replaces, from the user's words or a round's answers, and before the agreement, search `docs/` and `AGENTS.md` once for the ids it replaces, the ids that cite them and the change's terms, as [the sync](../method/references/sync.md)'s second step does, and read each hit in its context. Sort each hit:
   - a document the yes will change;
   - a task the change makes obsolete;
   - a sealed document it makes untrue;
   - a product or scope choice it leaves open, which goes into the next round;
   - a stack or structure choice, named for architecture;
   - a plan's estimate or the overview, named for concept.

   Done when each hit is sorted.
5. **Record.** Write the decisions as drafts while you grill, in one session file from [its template](assets/session.md):
   - its number, `NN-`, is the next free one in `docs/decisions/`, drafts counted; `README.md` and `architecture.md` aren't numbered;
   - each id, `D<n>`, comes after the highest in the index, in every session file and in `architecture.md`, drafts counted;
   - a decision that replaces one says so in its Replaces line, linking the replaced record's heading;
   - a record names a story or a task by the id it has, and gives no id but its own: a story that moves keeps its id.

   Done when each decided area has its record.
6. **Agree.** Show the summary in parts:
   - **The decisions:** each id, title and decision, with what it replaces, saying which ones you chose for the user;
   - **The deferrals:** each with when it is decided and what the plan assumes until then;
   - **What the yes changes**, on a run where `AGENTS.md` links the concept: the decisions it replaces, the documents the sync will change, the tasks it makes obsolete, the sealed documents it makes untrue, and what is left for another step;
   - **What the yes writes:** the index's rows and statuses, the forward notes, and the sync, or no sync while there is no concept.

   Then ask in plain text, since a dialog would cover the summary, and end your reply:

   ```
   Are you satisfied with this, and do we agree on it?
   1. Yes, it's final
   2. Not yet: say what to change
   ```

   Make a change in the drafts, show what changed, and ask again. On the yes, and only then, write the final marks:
   - create the index from [its template](assets/index.md), if there is none;
   - add a row for each new decision, `holds`;
   - write `replaced by D<n>` in the Status cell of each decision a new one replaces;
   - add a dated forward note under each replaced record, in its session file or in `docs/decisions/architecture.md`, as the session's template shows;
   - log the session in the index's change log.

   Where the index has another form, keep its rows and its form, and add yours to it. Other steps take a decision as final only by its row in the index, so write no row before the yes. Done when the marks are written.
7. **Sync.** Where `AGENTS.md` links the concept, run [the sync](../method/references/sync.md) for the session's decisions: hand it to a subagent with the brief the sync gives, with the impact's documents as its list, or, where your host has no subagents, run it here. Otherwise skip it: the concept step writes its documents from the decisions. Done when you have its report, or you skipped it.
8. **Next step.** Take the next step from [the cycle](../method/references/cycle.md)'s Next column and the project's state: concept while `AGENTS.md` links no concept; else the step the change affects, such as concept for the plan or architecture for the stack. End with:

   ```
   **Decide: done.**
   **Written:** <the session file and the index, linked, and each record that gained a forward note>.
   <the sync's drift report, word for word as it came back, or "No sync: there is no concept yet.", or "No sync: the concept is still a draft.">
   **Open:** <the deferrals, each with its time, and the choices left for another step>, or nothing.
   **Next:** <step>, with <skill>: <why, from the project's state>.
   1. Start <skill> now (Recommended)
   2. Stop here
   ```

   Offer only a skill whose `../<skill>/SKILL.md` exists, or say it isn't installed, with no option. Start it only at the user's word. Done when the user chose, or you said it isn't installed.

## Stop

- If `AGENTS.md` has no line "The documents flow top-down: …", write nothing, and reply:

  ```
  **Gradatim · decide**

  **Decide: stopped.** This folder holds no Gradatim project: <what you found>. Nothing was written.
  **Next:** init, with `init-project`: it sets the project up.
  1. Start `init-project` now (Recommended)
  2. Stop here
  ```
- If the user says to stop at a question, keep the drafts. End with "**Decide: stopped.**", what was drafted, and that the next run offers to go on from it. Offer no option.
- If the user takes the research offer, keep the drafts. Say "**Decide: stopped.**", the question, and that the next decide run offers the drafts, then start `research-topics` with the question as its topic.

## Red flags

| Thought | Instead |
|---|---|
| "A short last reply, such as after "Stop here", needs no heading." | Every reply opens with `**Gradatim · decide**`, the last one too. |
| "The drift report reads better in my own words." | Show it as the sync wrote it, from "**Drift report**" on: its labels are what the user and the checks look for. |
