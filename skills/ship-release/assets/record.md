# The release record

*The template of `docs/RELEASES.md`, which the release step creates at a project's first release and adds to at each one after. The document is append-only: an entry for each release, newest last, and a dated note under one that is rolled back; nothing in it is rewritten. Its lines are fixed, since `../scripts/check-release.mjs` reads them, and new sprint reads a rolled-back release from them.*

````markdown
# <Project> · The releases

*One entry for each release, newest last, and a dated note under one that is rolled back. Written by the release step.*

## <version> · YYYY-MM-DD

- **Holds:** <ID>, <ID> and <ID>, from [sprint <n>](sprints/sprint-<n>/README.md).
- **Commit:** `<short sha>` on `<branch>`<, tagged `<tag>`>.
- **How:** <each release step, by the step or by the user>, as [the runbook](RUNBOOK.md) says.
- **The check:** <each line, with what showed it>; <a line not this release's, with why>.
- **Result:** shipped. | failed: <the line that failed>.

> **Rolled back, YYYY-MM-DD.** <The fault, and where it is>. <The rollback, and what its check showed>. The fix opens the next sprint.
````

- **The heading** names the release by the version the manifest names; where the project has none, by the date alone: `## YYYY-MM-DD`.
- **Holds** names each task the release ships by its id, with the sprints they closed in.
- **Result** is `shipped.` with no note under it, or `failed: …` with its note.
- **The note** goes only under a failed release. Where the runbook says the release can't be undone, it reads `> **Not rolled back, YYYY-MM-DD.** <why>. The fix goes forward in the next sprint.`
