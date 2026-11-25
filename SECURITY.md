# Security

## Supported versions

The latest release gets security fixes. Check that a problem is still there in it before you report it.

## What is in scope

- The scripts the skills run, in each skill's `scripts/` folder, among them the demo's runner, which starts your app's server and stops it.
- The OpenCode entry, `.opencode/plugins/gradatim.js`, and `index.js`.
- What a skill tells your host to do with git, GitHub's CLI and publishing a page: a commit, a push, a draft pull request or a published page that goes further than its step says, or past a rule of yours.

A fault in a host, a model or a service that a skill calls is for its own maker.

## Reporting a vulnerability

Use GitHub's private vulnerability reporting: on this repository's **Security** tab, choose **Report a vulnerability**. Please don't open a public issue for it. Say what an attacker could do, and give the version, the host and the steps that show it. The report stays between you and the maintainer until a fix is released.
