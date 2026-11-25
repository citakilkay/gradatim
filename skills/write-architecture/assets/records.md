# The architecture's records

*The template of `docs/decisions/architecture.md`, which the architecture step creates, and of the rows it adds to the decisions index. A run adds a dated section with a record for each choice, in decide's shape. The headings, the ids and the fields are fixed, since the index links each record's heading, the check reads the fields, and later steps cite the ids. The file is a draft until the yes, then append-only.*

````markdown
# The architecture's records

*The stack and the structure, as the architecture step agreed them with the user. Each run adds a dated section.*

## YYYY-MM-DD

### D<n> · <Title>

- **Decision:** <what holds, in a sentence or two>.
- **Over:** <what it was chosen over, and why not>.
- **Why:** <the reasons, citing decisions as D<n> and stories as M<n>>, <how the choice was made: the user's answer, found in the code, or chosen for the user>.
- **Date:** YYYY-MM-DD.
- **Replaces:** [D<k>](<the replaced record's file>#<its heading's anchor>).
````

- **Replaces** comes only where the record replaces one: a record of decide's, or of an earlier run.
- **A small choice** shares a record with its neighbours, such as the front end's language and framework. A choice that someone could overturn on its own gets its own record.
- **A deferral** is a record like any other. Its Decision reads: "<The choice> is decided by <a story, the MVP or phase k>. Until then, the architecture assumes <what>." Its row in the architecture's open choices names it.
- **The ids** come after the highest in the decisions index, in every session file and in this file, drafts counted.
- **An anchor** is the heading in lower case, its spaces as hyphens and its other marks dropped: `### D6 · A front end with Svelte` is `#d6--a-front-end-with-svelte`.
- **An index row** is a final mark, written at the yes. Until then the index lists none of this run's records, and a decision they replace still says `holds`. The row goes in the decisions index for each record, `| D<n> | <title> | [architecture](architecture.md#<anchor>) | holds |`, with `replaced by D<n>` in the Status cell of each decision a record replaces, and a row in the index's change log: "Added D<n> to D<m>, from the architecture".
- **A forward note** is a final mark too. It goes under each replaced record, after its last line, in that record's own file: this one, or decide's session.

  ```markdown
  > **Replaced by D<n>, YYYY-MM-DD.** <One sentence: what holds now> ([architecture](architecture.md#<the new record's anchor>)).
  ```
- **After the yes,** nothing in the file is rewritten. A correction is a dated note under its record.
