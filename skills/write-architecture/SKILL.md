---
name: write-architecture
description: "Agrees a Gradatim project's stack and structure with the user and writes its architecture, runbook and agent docs, recording each choice. Use when the user asks for Gradatim's architecture step, to choose or change the stack or the structure, or to add an agent doc."
license: MIT
---

# Write architecture

The fifth step of Gradatim's cycle, and the one that runs again whenever the stack, the structure or the agent docs change. From the concept, the plan and the decisions, it agrees the stack and the structure with the user, records each choice, and writes the architecture, the runbook and the agent docs, so that any agent keeps the cycle. What the project does is decide's, the plan's stories are the concept step's, and the sprints are new sprint's.

This skill writes only what "Reads and writes" lists, and makes only the git and GitHub writes its steps name.

**A usual run:** the concept, the plan, the decisions and the project's code read; one round of up to four questions; the records, the architecture, the runbook and two agent docs drafted and checked; the agreement; the index rows and `AGENTS.md`'s pointers at the yes. A later run shows the change, writes it at the yes, and runs the sync where a sprint exists. Make routine calls yourself, and ask only where a step says, or where two readings of the request would lead to different work.

## When to use

- The user asks for Gradatim's architecture step, or to choose the stack and the structure of the project.
- The user wants to change the stack or the structure, or to add an agent doc for a topic the project now has.
- Not for a change to what the project does, or to a decision that holds other than the stack: that is `decide-direction`. Not for the plan's stories, cut, order or estimates: that is `write-concept`. Not for facts a choice needs: that is `research-topics`. Not for sprints: that is `new-sprint`. Not for a folder with no Gradatim project: that is `init-project`.

## Reads and writes

| Document | Path | Use |
|---|---|---|
| Agent file | `AGENTS.md` | reads, changes |
| Research index | `docs/research/README.md` | reads |
| Research report | `docs/research/NN-<topic>.md` | reads |
| Decisions index | `docs/decisions/README.md` | reads, changes |
| Decision session | `docs/decisions/NN-<topic>.md` | reads, changes |
| Architecture's records | `docs/decisions/architecture.md` | reads, creates, changes |
| Concept | `docs/MAIN_CONCEPT.md` | reads |
| MVP | `docs/MVP.md` | reads |
| Phase | `docs/PHASE-<k>.md` | reads |
| Architecture | `docs/ARCHITECTURE.md` | reads, creates, changes |
| Runbook | `docs/RUNBOOK.md` | reads, creates, changes |
| Agent docs | `docs/agents/<topic>.md` | reads, creates, changes |

It also reads the project's own code and files, and changes none of them. It changes `AGENTS.md` and the index only at the yes, and in a decision session adds only a forward note. [The sync](../method/references/sync.md) changes what its own table lists. It writes nothing to git.

## Steps

1. **Start.** Open each reply with the line `**Gradatim · architecture**`, the reply to the user's last answer too, with what you found below it. Read the map of the host you run in, `../method/references/host-<host>.md`: if it says Gradatim is made for another model than yours, say so once, above the heading, as it words it. If `AGENTS.md` has no line "The documents flow top-down: …", this folder holds no Gradatim project: stop, as "Stop" says. If the user didn't ask for this step, as with a remark on the stack, answer what they did say, then say in a line that it would agree the stack and the structure and write the architecture, the runbook and the agent docs, and wait for the yes. If there is no decisions index, stop, as "Stop" says: decide alone creates it, and a record is final only by its row there. If `AGENTS.md` links no concept, name concept as the step that writes the plan, and offer `write-concept` (recommended) or going on from the decisions alone, which you do only at the user's word. A first run is one where the index lists no record of `docs/decisions/architecture.md`. Records or documents of this step that the index doesn't list are a stopped run's drafts, or the user's own: ask first, as a question of its own, whether to go on from them or to start over. An architecture or a runbook whose opening line doesn't name the architecture step is the project's own, not a draft: ask instead, as a question of its own, "Take it in (Recommended)", read as an input and written over, since git's last commit keeps it, or "Stop here"; where git's last commit doesn't hold it, stop, as "Stop" says. [The capabilities](../method/references/capabilities.md), [the contract](../method/references/contract.md) and [the documents](../method/references/documents.md) hold the details: read one when a step needs it. Done when the inputs are there, or the user chose to go on without one.
2. **Read.** Read the concept, the MVP and the phases; the decisions index and the records whose row says `holds`, taking a deferral's assumption until its time; the report on the code, `NN-the-code.md`, where the research index lists one, for the stack and the commands; and the project's own code and files only for what that report leaves open, such as a manifest and the entry files. The stack they show is the user's, as found. Read a research report only where a decision cites a finding a choice needs. Then sort the choices:
   - **hard to undo**, such as the language, the framework, the data store, the hosting and the module boundaries: ask;
   - **easy to change**: your call, listed in the agreement for the user to overturn;
   - **needed only by a later milestone**: a deferral, pinned to a story, the MVP or a phase, with what the architecture assumes until then.

   Where the code and the decisions settle a choice, record it and ask nothing. Nothing is searched on the web: a question that needs facts offers `research-topics`.
   - **Yours to change:** the stack and the structure, a decision of decide's about the stack (replaced by a record of your own), and the agent docs.
   - **Not yours:** whatever a decision that holds settles other than the stack; the plan's stories, cut, order and estimates; and a module's code once the sprint rules list it. Stop on the first two, as "Stop" says.

   Done when each choice is found, to ask, or yours.
3. **The round.** Ask what is hard to undo in one round of up to four questions, the most consequential first, each standing alone. Each question opens `**Q<k> · <title>**`, never as an item of a numbered list. Then two to five lines on what the documents say, citing decisions as `D<n>` and stories as `M<n>`, and what the answer changes. Then two to four options, numbered from 1, the recommended one first, with its reason. Where your question tool takes several questions, ask the round in one call; without one, or when it comes back without an answer, ask in plain text, and end your reply after the last question's options, with nothing after them. "Take your recommendations" takes them all, as the user's choice. A second round only where an answer opens a question. Ask no round where the code and the decisions settle everything, and on a later run ask only for a hard choice the change leaves open. Done when the user answered, or nothing was open.
4. **Draft.** Write as you go. The records first, in `docs/decisions/architecture.md` from [its template](assets/records.md): a dated section for the run, and a record for each choice, small choices sharing one. The ids come after the highest in the decisions index, in every session file and in this file, drafts counted. Each Why ends with how the choice was made: "the user's answer", "found in the code" or "chosen for the user". A choice left open is a deferral record, as the template words it. A record that replaces one names it in its Replaces line. Then [the architecture](assets/architecture.md), [the runbook](assets/runbook.md), [the development cycle](assets/development-cycle.md) and [the commands](assets/commands.md); and another file in `docs/agents/` only where the architecture has its topic, such as an API's structure. Every module gets a code of three capitals and names its stories; infrastructure work gets a module of its own. Name no task or task id in the architecture. On a later run, write only the records' new section before the yes, and show the change to each other document in the agreement: the architecture is final once the index lists its records, so a change written before the yes would read as agreed. Done when the drafts are written, or the change is shown.
5. **Check.** Run `node <this skill's folder>/../method/scripts/check-architecture.mjs <the project's folder>`, and fix each fault it names. On a first run, run it before the agreement; on a later run, at the yes, once the change is written. Done when it ends with "0 faults".
6. **Agree.** Show the summary in five parts: the records, each id, title and decision, saying which you chose for the user, which you found in the code, and what each replaces; the architecture, with its modules, their codes and stories, its deployment view, and its open choices with their milestones; the runbook; the agent docs, each with the pointer `AGENTS.md` will gain for it; and what the yes writes. Each part says what you wrote, what you chose for the user, what is open, and what the yes will write. Then ask in plain text, since a dialog would cover the summary, and end your reply:

   ```
   Are you satisfied with this, and do we agree on it?
   1. Yes, it's final
   2. Not yet: say what to change
   ```

   Make a change in the drafts, or in the change you show, show what changed, and ask again. On the yes, and only then, write the final marks:
   - in the decisions index, a row for each new record, `replaced by D<n>` in the Status cell of each decision a new record replaces, and a row in its change log, as [the records template](assets/records.md) shows;
   - a forward note under each record a new one replaces, in that record's own file;
   - in `AGENTS.md`, keeping every line it has, the section below, with one pointer for the architecture, one for the runbook and one for each agent doc; a later run adds the pointer of a new doc, and changes those whose file changed;
   - on a later run, the change to each document, with a row in the change log of the architecture and the runbook where they change.

   The section for `AGENTS.md`:

   ```
   ## The architecture and the agent docs

   What only some tasks need lives in the files below.

   - **Before <the work>**, read [<name>](docs/…): <what it holds>.
   ```

   Then run the check again; a fault that needs a choice goes back to the user before you finish. Done when the marks are written and the check ends with "0 faults".
7. **Sync.** Where `docs/sprints/README.md` exists, run [the sync](../method/references/sync.md) for the run's records: hand it to a subagent with the brief the sync gives, the records as its source, or, where your host has no subagents, run it here. Where there is no sprint, skip it. Done when you have its report, or you skipped it.
8. **Next step.** Take the next step from [the cycle](../method/references/cycle.md)'s Next column and the project's state: new sprint while no sprint is open, else the step the change affects. End with:

   ```
   **Architecture: done.**
   **Written:** <each file, linked>.
   <the sync's drift report, word for word as it came back, or "No sync: no sprint sits below the architecture yet.">
   **Open:** <each open choice with its milestone, and what is left for another step>, or nothing.
   **Next:** <step>, with <skill>: <why, from the project's state>.
   1. Start <skill> now (Recommended)
   2. Stop here
   ```

   Offer only a skill whose `../<skill>/SKILL.md` exists, or say it isn't installed, with no option. Start it only at the user's word. Done when the user chose, or you said it isn't installed.

## Stop

- If `AGENTS.md` has no line "The documents flow top-down: …", write nothing, and reply:

  ```
  **Gradatim · architecture**

  **Architecture: stopped.** This folder holds no Gradatim project: <what you found>. Nothing was written.
  **Next:** init, with `init-project`: it sets the project up.
  1. Start `init-project` now (Recommended)
  2. Stop here
  ```
- If there is no decisions index, write nothing, and reply:

  ```
  **Gradatim · architecture**

  **Architecture: stopped.** This project has no decisions index: <what you found>. Decide creates it, and a decision is final only by its row there. Nothing was written.
  **Next:** decide, with `decide-direction`: it settles the open choices and records them.
  1. Start `decide-direction` now (Recommended)
  2. Stop here
  ```
- If the user asks for what a decision that holds settles other than the stack, or for a change to the plan's stories, cut, order or estimates, write nothing, and reply:

  ```
  **Gradatim · architecture**

  **Architecture: stopped.** <The ask> goes against D<n>, which settles <what>, or changes the plan's stories, cut, order or estimates. Nothing was written.
  **Next:** <decide, with `decide-direction`: it records the change, and its sync carries it down; or concept, with `write-concept`: it changes the plan>.
  1. Start <skill> now (Recommended)
  2. Stop here
  ```
- If an architecture or a runbook at its path is the project's own, and git's last commit doesn't hold it, write nothing, and reply:

  ```
  **Gradatim · architecture**

  **Architecture: stopped.** <The file> is the project's own, and git's last commit doesn't hold it, so the architecture written there would lose it. Nothing was written.
  **Next:** architecture, with `write-architecture`, once <the file> is committed or moved.
  ```
- If the user says to stop at a question, keep what was drafted. End with "**Architecture: stopped.**", what was drafted, and that the next run offers to go on from it. Offer no option.

In each, offer only a skill whose `../<skill>/SKILL.md` exists, or say it isn't installed, with no option.
