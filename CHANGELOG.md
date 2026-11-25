# Changelog

Every notable change to Gradatim, newest first. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- The cycle's table says more exactly what research, decide, architecture and demo do. A demo records the feature you ask for, or the whole UI.
- `write-architecture` and `record-demo` describe themselves the same way. Architecture writes its documents from the stack and structure you choose and designs nothing on its own: it asks you about a choice that is hard to undo.
- The README shows the cycle as a chart that names each step's skill, and its table gives an example call for each skill.

## [1.0.0] - 2026-11-25

The first public release.

### Added

- Fourteen skills, one for each step of the cycle: `init-project`, `research-topics`, `decide-direction`, `write-concept`, `write-architecture`, `new-sprint`, `design-task`, `build-task`, `close-task`, `draft-pr`, `close-sprint`, `ship-release`, `review-project` and `record-demo`. Beside them, `method` tells where a project stands and which step comes next, and `hello` checks an install.
- The method every skill shares: the cycle and its loops; the map of the documents a project gets, each with the one step that creates it; the contract every step keeps, which drafts first, waits for your agreement before anything is final, and ends by naming the next step; and the sync, which carries a change down the documents it touches.
- Checks that need only Node 20 or later, with no install: a project's links, ids, statuses and seals; its plan, architecture, sprints, designs and release record; a research report's quotes; and a demo's walkthrough.
- HTML artifacts: a project's overview, a large pull request's explainer and a review's ranked report, each a standalone page. Where your host can publish and your rules allow it, a page is published on claude.ai.
- A project that already has code: its code is read once into a cited report, Gradatim's documents go to `docs/gradatim/` where your files already hold its paths, and a quick start reaches the first task's design with one agreement.
- Five hosts: Claude Code, Codex, GitHub Copilot, OpenCode and Cursor. On Claude Code, Codex and Copilot, Gradatim installs from its own marketplace as `gradatim@gradus`.
- On Claude Code, a subagent runs on the model its job's kind calls for. Your own rule on a subagent's model wins.
- A guide for each skill in `docs/guides/`, with the install guide and a worked example.

## [0.1.0] - 2026-10-28

A private development version.
