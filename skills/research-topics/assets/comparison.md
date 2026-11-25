# The comparison

*The template of the report that sets ideas for one choice side by side. `research-topics` writes it after the ideas' own reports, from them alone, and numbers it after them. It adds no source: each cell cites a finding of an idea's report, as `NN Fk`. The headings are fixed, since the decide step reads the parts by them, and `scripts/check-report.mjs` checks each cited finding.*

````markdown
# NN · Compares <the ideas> for <the choice>

*Compared YYYY-MM-DD from [NN](NN-<topic>.md) and [NN](NN-<topic>.md), for <the choice it feeds>. It decides nothing, and it adds no source.*

## Summary

<Three to six lines: where the ideas differ, and where they are alike. No idea is named as the one to take.>

## The ideas side by side

| Question | <Idea A> | <Idea B> |
|---|---|---|
| <A sub-question both reports answered> | <What A's report found> (01 F2) | <What B's report found> (02 F1) |

## Risks, watch-outs and trade-offs

- **Trade-off:** <what one idea gains over the other, and what it costs> (01 F3, 02 F2).
- **Risk:** <a risk one idea carries and the other doesn't> (02 F4).
- **Watch out:** <a limit or a term that matters to the choice> (01 F5).

## Gaps

- <What neither report settled, and what would.>

## Notes
````

- **The table:** one row per question that the reports share, and one column per idea. Each cell ends with the finding it rests on, or says "not found" with the report's number.
- **No pick.** The comparison sets out how the ideas differ. Choosing one is the decide step's work.
