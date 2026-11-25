# Cursor

*The map from each capability in [capabilities.md](capabilities.md) to Cursor's tools. Checked on 2026-10-28, from Cursor's docs and changelog. Not tried here: Cursor isn't installed on the owner's machine.*

| Capability | Tool | Notes |
|---|---|---|
| Ask the user | Ask questions | The agent keeps working while it waits, so do nothing that depends on the choice until the answer comes |
| Hand work to a subagent | Subagents: the built-in Explore and Browser, or custom ones | One level deep: a subagent can't start its own. The docs don't say whether a skill can ask for one |
| Search the web | Web | |
| Fetch a page | None found in the editor | Fetch it with a command, or ask the user for the text |
| Research tools | The MCP servers the user added | |
| Drive a browser | Browser | Built in, in a pane of the editor |
| Run a command | Run shell commands | In a sandbox where possible; the user's Run Mode decides what asks first |
| Show an artifact | The Browser pane | Canvases show Cursor's own components, not any HTML file: open the file in the Browser pane, or give its path |
| Keep a todo list | To-dos | |
| Start another Gradatim skill | None | Read `../<skill>/SKILL.md`. The docs don't say how Cursor names a plugin's skills |

## Calling Gradatim's skills

The user types `/` in the Agent chat and picks the skill, which then applies to that one message. Cursor may also start a skill on its own when its description fits the task.

## The instruction file

Cursor reads `AGENTS.md` at the root and in subfolders, where the closer file wins, together with its own rules in `.cursor/rules/`, which must be `.mdc` files. Nothing needs to be added.

## Adding an MCP server

`.cursor/mcp.json` in the project, or the same file in the user's home folder.

## When nobody can answer

Not tried here. Ask in plain text and end the reply.
