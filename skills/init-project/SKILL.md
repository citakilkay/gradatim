---
name: init-project
description: "Sets up a project for Gradatim: git, and an AGENTS.md that holds the idea, who works on it and the cycle; in a project in progress, a quick start to its first task. Use when the user asks for Gradatim's init step, to start a project from an idea with Gradatim, or to set up Gradatim in this folder."
license: MIT
---

# Init a project

The first step of Gradatim's cycle. It takes the user's idea and sets up the project's folder, this one or a new one, with git and `AGENTS.md`. Then it shows the cycle and offers research, or, in a project that already has code and work under way, runs the quick start to the first task's design. Every other file, such as `docs/` or a stack's files, is the later steps' work.

This skill writes only what "Reads and writes" lists, and makes only the git and GitHub writes its steps name.

**A usual run:** a look at the folder, two or three questions, `git init` and one file. A quick start adds one read of the code, a round only where something is open, the drafts and one agreement. Make routine calls yourself, and ask only where a step says, or where two readings of the request would lead to different work.

## When to use

- The user has an idea and wants to start a project with Gradatim, or wants Gradatim set up in this folder.
- Not for a folder that already holds a Gradatim project: that is `method`, which tells where it stands. A quick start that stopped is the one exception, as "Stop" says.
- Not for a changed idea or direction: that is `decide-direction`.

## Reads and writes

| Document | Path | Use |
|---|---|---|
| Agent file | `AGENTS.md` | reads, creates, changes |

It also runs `git init` where no repository holds the folder. It reads the folder's other files, and changes none of them. Its quick start also writes, on their steps' behalf, what [the quick start](../method/references/quick-start.md)'s table lists.

## Steps

1. **Start.** Open each reply with the line `**Gradatim · init**`, with what you found below it. Read the map of the host you run in, `../method/references/host-<host>.md`: if it says Gradatim is made for another model than yours, say so once, above the heading, as it words it. If the user didn't ask for this step, answer what they did ask, then say in a line that it would run `git init` and write `AGENTS.md` with their idea, and wait for the yes. [The capabilities](../method/references/capabilities.md), [the contract](../method/references/contract.md) and [the documents](../method/references/documents.md) hold the details: read one when a step needs it. Done when the user asked for this step, or said yes.
2. **Look** at the folder, writing nothing, until you know:
   - whether a repository holds it, that repository's top folder, and its base branch;
   - what it holds, at the top and in `docs/`, with the project's own plan of work under way, such as a sprint or a task list;
   - which paths of [the documents](../method/references/documents.md)' map hold a file of the project's own, in any folder: one is enough for Gradatim's documents to go in `docs/gradatim/`;
   - a git rule in its instruction files, such as one that asks first or bars git writes; and, through the host's map, its hooks, its settings and its own skills;
   - whether its `AGENTS.md` holds the line "The documents flow top-down: …", which ends the run as "Stop" says;
   - whether a `CLAUDE.md`, `.claude/CLAUDE.md` or `CLAUDE.local.md` sits in it or in a folder above it. The user's own `.claude/CLAUDE.md` in their home folder doesn't count.

   Done when you can say what the folder holds.
3. **The idea.** Take it from the user's words, in this message or an earlier one, exactly as written: questioning it is the decide step's work. In a folder with code, where there are none, take what the project is from its README, and don't ask. Otherwise, if there is none, ask for it in plain text, with no options, and end your reply. Done when you have the idea.
4. **Where.** Where a repository holds a project with code, it is this folder: don't ask. Otherwise ask "Where should the project go?", after two to five lines on what the folder holds and what you will do there: `git init` unless a repository holds it, `AGENTS.md` written or added to, and every other file kept. The options:
   - "This folder", with its path;
   - "A new folder", with its full path: a short name from the idea, in lowercase with hyphens, inside this folder. Where a repository holds this folder, the new one goes beside that repository's top folder instead, so that one repository doesn't sit inside another.

   Recommend this folder when it is empty or holds a project of its own, and a new folder when it holds other projects' folders, or is the home folder or a drive's root, with the reason. Without a question tool, or when it comes back without an answer, ask in plain text with the options numbered, and end your reply. The user may name another folder; one that exists and isn't empty can't be used. Done when the user chose.
5. **Who works on it.** Once where is settled, ask "Who will work on this project?" as Where is asked, with the options:
   - "One developer": each task is built on `main`, with no branch or pull request of its own unless it calls for one;
   - "A team": each task gets its own branch and a pull request.

   Recommend what that folder shows, such as a team where its history has several authors, and otherwise one developer, with the reason. In a folder with code, ask it in one reply with "How should Gradatim start here?", whose options are "From what's here (Recommended)": one read of the code and one agreement to the first task's design; and "The full cycle": research, decide, concept, architecture and new sprint, each with its own agreement. There the options of "Who will work on this project?" name the base found, such as "One developer, on `master`". Above them, in two to six lines, say what you found and what Gradatim will do: the folder its documents go in; each git rule and hook, which it follows, asking where one refuses a write; and the project's own skills, each beside the Gradatim step that does the same work. A hook that refuses writes where Gradatim's documents go is asked about first, alone, as [the capabilities](../method/references/capabilities.md#a-refused-write) say. Done when the user chose.
6. **Write**, in the folder the user chose: create it if it is new; run `git init` unless a repository holds it, as `git init <path>` when it isn't the folder you run in; and write `AGENTS.md` from the block below. Make no commit: that is the user's.

   Where Gradatim's documents go in a folder of their own, add the folder's line below "This project follows Gradatim's cycle.", and write the list's paths inside that folder. The user may name another folder:

   ```
   Gradatim's documents are in `docs/gradatim/`: each `docs/` path of its steps stands for it, and the project's own files and rules stay as they are.
   ```

   The block is fixed. Every later step finds the project by its order line, "The documents flow top-down: …", so write that line exactly, in any language, as the first line in the file with two arrows (→). Write the idea exactly as the user wrote it, and who works on it in the block's words, since later steps read that line too. Where `AGENTS.md` exists, keep every line of it, and add the block's two sections, "The project" and "How the work runs", after its last line, or above the section of a line that already holds two arrows.

   ```markdown
   # AGENTS.md

   The instruction file for every coding agent working on this project: Claude Code, Codex, GitHub Copilot, OpenCode, Cursor and others. Claude Code reads it only while no `CLAUDE.md` sits in this folder or above it.

   ## The project

   <One or two sentences: what the project is, named as the idea names it, or after its folder.>

   ### The idea

   <The idea, exactly as the user wrote it.>

   ## How the work runs

   This project follows Gradatim's cycle.

   <"One developer works on this project." or "A team works on this project.", as the user chose.>

   The documents flow top-down: Concept → MVP and phases → Architecture → Sprints → Tasks.

   1. init: this file.
   2. research: reports in `docs/research/`.
   3. decide: decisions in `docs/decisions/`.
   4. concept: `docs/MAIN_CONCEPT.md`, `docs/MVP.md`, `docs/ROADMAP.md` and the phases.
   5. architecture: `docs/ARCHITECTURE.md`, `docs/RUNBOOK.md` and `docs/agents/`.
   6. new sprint; then, for each task, design task, build task, close task and, where a pull request is due, draft PR; then close sprint.
   7. release, review and demo, when each is due.
   ```

   Done when `AGENTS.md` holds the order line: it is this step's final mark.
7. **Quick start.** Only where the user chose "From what's here": follow [the quick start](../method/references/quick-start.md), with its read, its round, its drafts, its agreement and its marks. Its hardest lines, kept here too:
   - write only its table, in the folder `AGENTS.md` names: never a file of the project's own, a hook or a setting;
   - one round at most, one agreement, and no final mark before the yes;
   - each document from its step's template, with its opening line; the plan names no decision before the yes;
   - the project's names stay: its codes, its task ids up to "Own up to", its open sprint's number;
   - the three checks at "0 faults" before the agreement and after the marks; after a compaction, read the file again.

   Done when its marks are written, or the user stopped.
8. **Show**, for the full cycle, in your reply:
   - what you did: the folder, the repository made or found, `AGENTS.md` written or added to, with every other file kept, and who works on the project;
   - the cycle's 14 steps, from [the cycle](../method/references/cycle.md)'s table, as a numbered list, one line each, then its loops in two lines;
   - in a folder that held files: each document you found, such as a README or a file in `docs/`, with the step that will draw on it: research for open questions, concept for what the project is, architecture for the code and how it is built. The files stay the project's own;
   - each git rule, hook and setting you found, with what Gradatim will do, and the project's own skills, each beside the Gradatim step that does the same work;
   - for a `CLAUDE.md` you found: that Claude Code reads `AGENTS.md` only while no such file sits in the project's folder or above it, and the two remedies in [Claude Code's map](../method/references/host-claude-code.md#the-instruction-file). Change nothing in that file;
   - three to six topics the idea raises for research. Each is a question that facts can answer, such as what exists, what it costs or what limits it, and then the choice it feeds: "Which map services allow offline tiles for free? This decides how the app works without a network." A choice itself, such as how a feature should work, is the decide step's, not a topic. In a folder with code, the first topic is "What does the code already do?": research reads the code once, for the steps after it.

   Done when these are shown.
9. **Next step.** It is research, with `research-topics`, to look into those topics, unless the project's documents show research done: then it is the step that [the cycle](../method/references/cycle.md)'s "Where the project stands" gives. After the quick start, it is design task, with `design-task`, for the sprint's first task. In a new folder, the host must start there to load `AGENTS.md`: say to open it in that folder and run the step from there, and offer no option. Otherwise end with:

   ```
   **Init: done.**
   **Written:** <AGENTS.md, and what the quick start wrote, each linked>.
   **Open:** nothing.
   **Next:** <step>, with <skill>: <why, from the project's state>.
   1. Start <skill> now (Recommended)
   2. Stop here
   ```

   Offer the skill only if `../<skill>/SKILL.md` exists; otherwise say it isn't installed, with no option. Start it only at the user's word. Done when the user chose, or you said where to run it, or that it isn't installed.

## Stop

- If the folder's `AGENTS.md` already holds the order line, the folder holds a Gradatim project. Where it links no concept and the folder holds code, a quick start stopped, or the project was set up before it: ask whether to go on from the drafts with the quick start (recommended), or to start method. Otherwise write nothing, and say so. End with "**Init: stopped.**", then "**Next:** method, with `method`: it tells where the project stands.", and the options "1. Start method now (Recommended)" and "2. Stop here".
- If the user says to stop at a question, write nothing. End with "**Init: stopped.**": nothing was written, and init can run again when they are ready. Offer no option.
