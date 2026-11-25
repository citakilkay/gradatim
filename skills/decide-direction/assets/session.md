# The decision session

*The template of a decide session's file, `docs/decisions/NN-<topic>.md`: one file per run, with a record for each decision. Its headings, ids and links are fixed, since the index links each record's heading, the sync's check reads the ids, and later steps cite them. The file is a draft until the yes, then append-only.*

````markdown
# NN · <Topic>

*Decide's <first, second…> session, YYYY-MM-DD, from <the research in [docs/research/](../research/README.md)>, or from <the user's new direction, in their own words: "…">: <what it settled>.*

### D<n> · <Title>

- **Decision:** <what holds, in a sentence or two>.
- **Over:** <what it was chosen over, and why not>.
- **Why:** <the reasons, citing findings as (NN Fk) and decisions as D<n>>.
- **Date:** YYYY-MM-DD.
- **Replaces:** [D<k>](<the replaced record's file>#<its heading's anchor>).
````

- **Replaces** comes only where the record replaces one.
- **A deferral** is a record like any other. Its Decision reads: "<The area> is decided <when, such as before the MVP's release>. Until then, the plan assumes <what>."
- **A forward note** is a final mark, written at the yes. It goes under the record that a later one replaces, after the record's last line, in that record's own file:

  ```markdown
  > **Replaced by D<n>, YYYY-MM-DD.** <one sentence: what holds now> ([NN](NN-<topic>.md#<the new record's anchor>)).
  ```
- **An anchor** is the heading in lower case, its spaces as hyphens and its other marks dropped: `### D4 · Shelves that work offline` is `#d4--shelves-that-work-offline`.
- **After the yes**, nothing in the file is rewritten. A correction is a dated note under its record.
