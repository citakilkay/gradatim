# Claude Code

*The map from each capability in [capabilities.md](capabilities.md) to Claude Code's tools. Checked on 2026-10-28, against Claude Code's docs and version 2.1.301; the instruction file on 2026-11-02, against its memory docs; the artifact on 2026-11-10, against its artifacts docs and version 2.1.318; the browsers on 2026-11-08, against its desktop and Chrome docs; a subagent's model on 2026-11-13, against its subagents docs and version 2.1.322; hooks on 2026-11-18, against its hooks docs. Tried here.*

| Capability | Tool | Notes |
|---|---|---|
| Ask the user | `AskUserQuestion` | 1 to 4 questions per call, each with 2 to 4 options and a header of at most 12 characters. The tool adds "Other". Subagents don't have it, and a `claude -p` run doesn't offer it |
| Hand work to a subagent | `Agent` | It runs in the background by default, so wait for its result. To give a subagent an answer, continue it by its id with `SendMessage`, which may need loading first |
| Search the web | `WebSearch` | Not on Amazon Bedrock |
| Fetch a page | `WebFetch` | A second model summarises the page, so where exact text matters, fetch it with a command |
| Research tools | The MCP servers the user added | Their tools may be listed by name only: load them with `ToolSearch` |
| Drive a browser | The desktop app's Browser pane, or an MCP server such as Playwright MCP; Claude in Chrome last | The Browser pane, in the desktop app's local sessions, has a clean profile with none of the user's logins. Claude in Chrome drives the user's own Chrome and logins: use it only for a check that needs their signed-in session, at their yes. It needs a direct Anthropic plan and `/login`, starts with `claude --chrome`, and doesn't run in WSL |
| Run a command | `Bash`, and `PowerShell` on Windows | The user's permission mode decides which commands ask first |
| Show an artifact | `Artifact` | Publishing makes a page on claude.ai that only the user sees, until they open it and share it there, with their organization or as a public link. It has no prompt of its own, so publish only where a step says, and the file as it is. It needs a Pro, Max, Ultra, Team or Enterprise plan and `/login`. A page is updated from its address: in a later session, find it by its title in the tool's list, or a new page is made. Relative links don't resolve there |
| Keep a todo list | `TaskCreate`, `TaskUpdate` | Off by default on the Claude 5 models; the user turns them on with `CLAUDE_CODE_ENABLE_TODO_TOOLS=1` |
| Start another Gradatim skill | `Skill`, with `gradatim:<skill>` | Only at the user's word. To see whether a skill is installed, look for its file, `../<skill>/SKILL.md`: calling the tool starts it. Claude Code keeps a skill started this way through compaction |

## A subagent's model

| Model | Kinds |
|---|---|
| `haiku` | a lookup |
| `sonnet` | a verification, a light build, light research |
| `opus` | a build, research, a report, a code review, an implementation plan |
| `fable` | a decision |

Ask for the kind's model on the call, by these names, and set no effort.

## Every reply

On this host, keep these lines of every skill, whatever the model:
- Open each reply with the heading line the skill's Start gives, such as `**Gradatim · hello**`, on a line of its own: nothing above it, and nothing after it on that line. It is the same on every reply, whatever step or tool you are on.
- If you want to say what you found, say it before your last tool call. The message after it opens with the heading.

## Calling Gradatim's skills

Claude Code puts a plugin's skills under the plugin's name. The user types `/gradatim:<skill>`, and a `claude -p` run can take `/gradatim:<skill>` as its prompt. A project's skill of the same name stays apart, as `/<skill>`. Where no other skill or command holds the name, a bare `/<skill>` starts Gradatim's too: tried with `/hello` on 2026-10-29, on version 2.1.312.

## The instruction file

Claude Code 2.1.277 and later reads `AGENTS.md` only when there is no `CLAUDE.md`, `.claude/CLAUDE.md` or `CLAUDE.local.md` in the working folder or above it, at its default setting. The user's own `~/.claude/CLAUDE.md` doesn't count. If the project has one, offer either remedy:
- **For everyone who clones the project:** the line `@AGENTS.md` in that `CLAUDE.md`, which imports the file. Claude Code never reads it twice.
- **For this user only:** in `/config`, set **Project instructions** to `claude-md-and-agents-md`. Claude Code reads this setting from the user's own settings, never from a project's. `/config` opens in the terminal only: in the VS Code panel or the desktop app, the user sets it in `~/.claude/settings.json`, as Claude Code's memory docs show.

Gradatim never writes a `CLAUDE.md` of its own.

## Hooks, settings and a project's skills

A project's hooks and settings are in `.claude/settings.json` and `.claude/settings.local.json`, and its own skills in `.claude/skills/<name>/SKILL.md`. A hook that refuses a call shows as that tool's error, "PreToolUse:<tool> hook error: …", with the hook's message. Gradatim changes none of them.

## Adding an MCP server

`claude mcp add <name> <command> [arguments]` adds a server that runs on the user's machine, and `claude mcp add --transport http <name> <url>` a hosted one. By default it is for this project and this user only. `--scope project` writes it to the project's shared `.mcp.json`, and `--scope user` adds it to all of the user's projects.

## When nobody can answer

A `claude -p` run doesn't offer `AskUserQuestion`. Ask in plain text and end the reply. The user answers with `claude -p --resume <session id> "<answer>"`.
