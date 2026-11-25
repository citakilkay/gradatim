# Artifacts

*How a step makes the HTML page it presents: concept's overview, draft PR's explainer and review's report. Written by MTH-4 on 2026-11-05. The kit's look is [artifact.css](../assets/artifact.css), each kind's template sits beside it, and its scripts, `wrap-artifact.mjs` and `check-artifact.mjs`, are in the method's `scripts/`.*

**A usual artifact:** the kind's template, the documents it shows, one write and one command.

## The hard lines

- **Its name** is its row's in [documents.md](documents.md), in `docs/artifacts/`, with one number sequence for the folder: `NN-overview.html`, `NN-pr-<topic>.html` or `NN-review-sprint-<n>.html`. The overview is made again in place, and keeps its number.
- **Write only the content:** a `<title>`, then one `<main>`. Never a `<head>`, a `<style>` or a `<script>`: the wrap adds the kit's shell, and a page runs no script.
- **Nothing from the network:** no image, font, style or script from an address. A diagram or a mockup is inline SVG or HTML with the kit's classes, and an image is a `data:` address.
- **Colours only from the kit:** its classes, or `var(--…)` and `currentColor` in a `style` attribute or an SVG. A raw colour breaks dark mode.
- **Links** go to an `#id` in the page, or to a full address. Name a project's document by its path in `<code>`: a published copy can't follow a relative link.
- **A living page ends with its change log:** a "Change log" section with a Date and Change table. The overview is living, and so is a PR's explainer while its PR is open. A page made again keeps its rows and adds one. A review report is sealed once the sprint rules list it, and has none.
- **Its footer** names the step, the date, and the documents the page shows.
- **Wrap only a page your step writes,** never a sealed one.

## Making one

1. Read the kind's template: [the overview](../assets/overview.html), [a PR's explainer](../assets/pr-explainer.html) or [a review report](../assets/review-report.html). Fill each `{{…}}` from the documents. Repeat a part as often as the page needs, and drop a section that has nothing to show.
2. Write it to its path, then run `node <the method's folder>/scripts/wrap-artifact.mjs <the file>`. It puts the kit around the content, and checks the page. On a fault it changes nothing and names the fault: fix the content, and run it again.

Done when the wrap prints "no fault". Where a command is refused, give the user the command, as [the capabilities](capabilities.md#run-a-command) say.

## Showing it

- Give the file's path with the step's summary, and say to open it in a browser.
- Where your host's map says it can publish, the agreement gains "Yes, and publish it: <what the map says publishing makes>", before "Not yet". It runs after the final marks, as a git write does. Publish the file as it is, under its `<title>`, and only at that yes.
- The agreement then holds three options: final, publish and Not yet.
- **A PR's explainer** takes no such option. Where your host's map says it can publish, and no rule of the user's bars it, write it outside the project, in your host's scratch folder, and publish it once it is wrapped, with no question: its step gives the page's address, and the project keeps no file. Else it stays at its path in `docs/artifacts/`, on the pull request's branch.

## Keeping it current

- **The overview** shows the plan: the concept, the MVP, the roadmap and the phases. Concept makes it again when the plan changes, and review when its picks add stories. The sync leaves it to concept, and says so.
- **A PR's explainer** changes only while its PR is open, and is sealed at the merge.
- **A review report** is a draft until the sprint rules list it, and sealed from then on.
