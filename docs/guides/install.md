# Installing Gradatim

What you need, how to install, update and remove Gradatim on each of its five hosts, how to call a skill there, and what to do when something goes wrong.

## What you need

- **Node 20 or later.** The skills run their checks with it, and need no package installed.
- **git.** Init sets up a repository, and the build and the close commit their work, unless a rule of yours bars git writes.
- **One of the five hosts:** Claude Code, Codex, GitHub Copilot, OpenCode or Cursor.

## Claude Code

From a terminal:

```bash
claude plugin marketplace add citakilkay/gradatim
claude plugin install gradatim@gradus
```

In a session, the same is `/plugin marketplace add citakilkay/gradatim`, then `/plugin install gradatim@gradus`, which opens the plugin's details so that you choose where it installs.

- **Update:** `claude plugin marketplace update gradus`, which reads the repository again, then `claude plugin update gradatim@gradus`.
- **Remove:** `claude plugin uninstall gradatim@gradus`. `claude plugin marketplace remove gradus` also drops the marketplace, and uninstalls every plugin installed from it.

### A subagent's model

Where a step hands a job to a subagent, it names the job's kind, and on Claude Code it asks for the model that kind calls for:

| Model | Kinds of work |
|---|---|
| `haiku` | a lookup |
| `sonnet` | a verification, such as a task's acceptance criteria; a light build, a small build step that isn't complex |
| `opus` | a build, research, a report, a code review |

Your own rule wins: a line in your `AGENTS.md`, or your own words, on a subagent's model is followed in place of the table. To run every subagent on one model, set `CLAUDE_CODE_SUBAGENT_MODEL` to that model and `CLAUDE_CODE_SUBAGENT_MODEL_FORCE` to `1`, on Claude Code 2.1.257 or later. `CLAUDE_CODE_SUBAGENT_MODEL` alone loses to the model a step asks for. On the other hosts, the host chooses a subagent's model.

## Codex

```bash
codex plugin marketplace add citakilkay/gradatim
codex plugin add gradatim@gradus
```

Start a new session to use its skills. In a session, `/plugins` opens Codex's plugin browser, which installs and removes plugins too.

- **Update:** `codex plugin marketplace upgrade gradus`, which reads the repository again, then start a new session.
- **Remove:** `codex plugin remove gradatim@gradus`, then `codex plugin marketplace remove gradus`.

## GitHub Copilot

In Copilot CLI:

```bash
copilot plugin install citakilkay/gradatim
```

- **Update:** `copilot plugin update gradatim`.
- **Remove:** `copilot plugin uninstall gradatim`.

In VS Code, with the setting `chat.plugins.enabled` on, run **Chat: Install Plugin from Source** from the Command Palette, and enter `https://github.com/citakilkay/gradatim`. VS Code also loads a plugin that Copilot CLI installed. **Chat: Update Plugins** updates it, and its details in the Agent Customizations editor, under Plugins, hold **Uninstall**.

## OpenCode

```bash
opencode plugin add github:citakilkay/gradatim
```

Or clone the repository, and list its folder under `plugins` in your `opencode.json`, as a path.

- **Update:** `opencode plugin update`, which installs a newer version of each plugin that has one. A plugin added from a repository stays on the version it installed until then.
- **Remove:** `opencode plugin remove github:citakilkay/gradatim`, or take the folder's line out of `opencode.json`.

## Cursor

Clone the repository into Cursor's folder of local plugins, in your home folder:

```bash
git clone https://github.com/citakilkay/gradatim ~/.cursor/plugins/local/gradatim
```

On Windows, the folder is `%USERPROFILE%\.cursor\plugins\local\gradatim`. Then restart Cursor, or run **Developer: Reload Window**. On an Enterprise plan, an admin may keep local plugins off.

- **Update:** `git -C ~/.cursor/plugins/local/gradatim pull`, then reload the window.
- **Remove:** delete that folder, then reload the window.

## Calling a skill

Each skill's guide names it, such as `init-project` for the first step. On every host you may also ask for a step in your own words, such as "research these topics": a step that writes, started that way, asks before it writes.

| Host | How you call a skill |
|---|---|
| Claude Code | `/gradatim:<skill>`, such as `/gradatim:init-project`. A project's own skill of the same name stays apart, as `/<skill>`. Where no other skill or command holds the name, a bare `/<skill>` starts Gradatim's too |
| Codex | Type `$` and pick the skill, or open the `/skills` picker. Codex may also start a skill on its own when the task matches its description |
| GitHub Copilot | In Copilot CLI, name the skill with a slash in your prompt: "Use the /init-project skill". `/skills info` shows which plugin a skill came from. In VS Code, the skills also appear as slash commands. Copilot may start a skill on its own when your prompt matches its description |
| OpenCode | Ask for the skill by its name: "Use the init-project skill". OpenCode may also start one on its own from its description |
| Cursor | Type `/` in the Agent chat and pick the skill, which then applies to that one message. Cursor may also start a skill on its own when its description fits the task |

## When something goes wrong

- **Claude Code doesn't read `AGENTS.md`.** A `CLAUDE.md`, `.claude/CLAUDE.md` or `CLAUDE.local.md` in the project's folder, or in a folder above it, hides it from Claude Code at its default setting; your own `CLAUDE.md` in your home folder doesn't count. Either add the line `@AGENTS.md` to that `CLAUDE.md`, which imports the file for everyone who clones the project, or, for you alone, set **Project instructions** to `claude-md-and-agents-md` in `/config`, or in your own settings file from the VS Code panel or the desktop app, as [Claude Code's memory docs](https://code.claude.com/docs/en/memory) show. Gradatim never writes a `CLAUDE.md`.
- **Research has no Firecrawl or Exa.** Both are optional, and Gradatim ships neither. Without them, research uses your host's own web search and fetch, and says in its reply and in each report what they would have added. To add one, follow [Firecrawl's MCP page](https://docs.firecrawl.dev/mcp-server) or [Exa's](https://exa.ai/docs/reference/exa-mcp): both start with no key. Keys go in your host's MCP settings or in your environment, never in the project's files.
- **A page isn't published.** Only Claude Code publishes a page, on claude.ai, with a Pro, Max, Ultra, Team or Enterprise plan, once you have run `/login`. A step that makes a page offers to publish it in its agreement, and draft PR publishes its explainer with no question. Only you see a published page until you open it and share it there. Elsewhere, or under a rule of yours against publishing, the page is a file in the project's `docs/artifacts/`: open it in a browser.
- **A project's hook refuses a write.** Gradatim never goes round it, and changes no hook or setting itself. It names the hook and its file, and asks whether you let the write through or the step stops there. Init asks first, before anything else, about a hook that refuses writes where Gradatim's documents go.
- **A skill of the same name.** On Claude Code, Gradatim's skill stays apart under its full name, `/gradatim:<skill>`. On GitHub Copilot, a project's or your own skill of the same name wins over Gradatim's, and on OpenCode the two can clash.
- **A check is refused, or Node is missing.** A step that can't run one of its commands gives you the command to run yourself. Install Node 20 or later where a step's check can't start.
