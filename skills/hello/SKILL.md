---
name: hello
description: "Checks that Gradatim works in this host, from the install to the steps every skill shares. Use when the user asks for Gradatim's hello check, or whether Gradatim works here."
license: MIT
---

# Hello

A check that Gradatim works in this host. One run reads the host's map, asks the user a question and hands a small job to a subagent. It also runs the three steps every Gradatim skill shares, Start, Agree and Next step, so it shows the contract on this host too.

This skill writes only what "Reads and writes" lists, and makes only the git and GitHub writes its steps name.

**A usual run:** a question, a one-line job for a subagent, a ten-line report, the agreement and the next step. Make routine calls yourself, and ask only where a step says, or where two readings of the request would lead to different work.

## When to use

- The user asks for Gradatim's hello check, or whether Gradatim works here.
- Not for starting a project: that is `init-project`. Not for where a project stands: that is `method`.

## Reads and writes

| Document | Path | Use |
|---|---|---|
| Agent file | `AGENTS.md` | reads |

It also reads the host's map and one of the method's own files. It writes nothing.

## Steps

1. **Start.** Open each reply with the line `**Gradatim · hello**`, with what you found below it. Read the map of the host you run in, `../method/references/host-<host>.md`, and note its file name: if it says Gradatim is made for another model than yours, say so once, above the heading, as it words it. If this folder has no `AGENTS.md`, say that it holds no Gradatim project yet, and ask whether to go on without one (Recommended), since this check needs none, or to stop. [The capabilities](../method/references/capabilities.md) and [the contract](../method/references/contract.md) hold the details, should a step need one. Done when the folder has an `AGENTS.md`, or the user chose to go on.
2. **Question.** First say, in a line, what the answer changes: which file the subagent reads, and so the first line it reports. Then ask "Which file should the subagent read?", with "The method's index (Recommended)", since it lists every part of the method, and "The capabilities file". Without a question tool, or when it comes back without an answer, ask in plain text with the options numbered, and end your reply. Done when the user answered.
3. **Hand off.** Note the absolute path of the file the user chose: [the method's index](../method/references/README.md) or [the capabilities](../method/references/capabilities.md). Give a subagent this job, on the model your host's map gives a lookup: "Read <the file's absolute path>. Reply with its first line, exactly as written, and nothing else." Wait for its reply. Without a subagent, read the first line yourself, and say so once, in a line. Done when you have the first line.
4. **Report** in these ten lines, the same on every host, so that one host's check reads against another's:

   ```
   Gradatim is installed.
   Host: <the coding agent you run in, such as Claude Code or OpenCode>
   Model: <the model you are, as exactly as you know it>
   Map: <the file name of the map you read, or "none">
   Asked with: <the name of the question tool you used, or "plain text">
   Answer: <the file the user chose last, as an option or in their own words>
   Subagent: <the name of the tool that ran the job, or "inline">
   Read: <the absolute path of the file the job read>
   First line: <the first line that came back, exactly as written>
   Project: <"AGENTS.md found", or "none">
   ```

   Done when the ten lines are shown.
5. **Agree.** The report is the summary's one part. After it, ask in plain text, since a dialog would cover the report, and end your reply:

   ```
   Are you satisfied with this, and do we agree on it?
   1. Yes, it's final (Recommended)
   2. Not yet: read the other file
   ```

   On "not yet", go back to step 3 with the other file, then report and ask again. This check writes nothing, so it has no final marks. Done when the user said yes.
6. **Next step.** The next step is always `method`, which tells where this folder's project stands. End with:

   ```
   **Hello: done.**
   **Written:** nothing.
   **Next:** method, with `method`: <why, from this folder>.
   1. Start method now (Recommended)
   2. Stop here
   ```

   Start it only at the user's word. Done when the user chose.

## Stop

- If a file can't be read, answer `Gradatim is installed, but the method can't be read: <the path you tried>`, and stop.
