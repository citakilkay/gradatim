# Contributing to Gradatim

Thank you for helping. Gradatim is developed in a private repository, and each release is exported to this one. So an issue or a pull request here is a proposal: when a change is accepted, the maintainer applies it there, it lands with the next release, and that release's entry in [the CHANGELOG](CHANGELOG.md) credits you. A pull request is closed once its change is released, not merged.

## Reporting a problem or proposing a change

Open an issue. Say which host and model you ran, which skill, what you asked, what happened and what you expected. A step's reply and the documents it wrote help most. Leave out keys, private paths and anything else you wouldn't publish.

To report a vulnerability, see [SECURITY.md](SECURITY.md) instead.

## Trying a change from a clone

You need Node 20 or later and git. There is nothing to install: the scripts use Node alone.

- **Claude Code:** in a scratch project, start `claude --plugin-dir <your clone>`, then run `/gradatim:hello`. A new session reads the folder again.
- **OpenCode:** in a scratch project's `opencode.json`, list your clone's folder under `plugins`, as a path, then ask for the hello skill.

`hello` checks the install, and runs the steps every skill shares: it asks you a question, hands one job to a subagent, asks for your agreement and names the next step.

## Before you open a pull request

- Run `npm run check`. It checks the manifests, each skill's shape, the guides, every relative link and the sample project.
- After changing a skill's description, its "When to use" or its "Reads and writes", run `npm run guides`, which writes the skill's guide and the README's table again.
- A skill starts from [the template](skills/method/assets/skill-template.md), and keeps to [the contract](skills/method/references/contract.md), [the writing rules](skills/method/references/writing-rules.md) and [the document map](skills/method/references/documents.md). [The checklist](skills/method/references/checklist.md) lists what each skill passes; its items on runs are the maintainer's, who runs each skill's scenarios before a release.
- Write the text and the code yourself: copy nothing from another plugin.

## License

Gradatim is under the [MIT License](LICENSE). By contributing, you agree that your contribution is under it too.
