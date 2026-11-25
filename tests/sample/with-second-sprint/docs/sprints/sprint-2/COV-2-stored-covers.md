# COV-2 · Covers stored on the device, with Open Library's word

Parent: [sprint 2](README.md)

| | |
|---|---|
| Status | `to-do` |
| Story | M6, M9 |
| Depends on | — |
| Takes | `2026-11-14-COV-1-stored-covers.md` |

## Goal

Each book's cover is fetched by its cover ID and shown offline, with a placeholder when there is none, and Open Library's answer on storing covers is recorded and followed (M6, M9, D2, D6).

## Scope

**In**
- All that the deferred item carries, since COV-1's build had not started.
- Asking openlibrary@archive.org, early in the task, whether an app may store covers on the device; the user sends the mail.
- Fetching `covers.openlibrary.org/b/id/{id}-M.jpg` and storing the Blob.
- The switch between storing the image and keeping only the URL, and the placeholder.

**Out**
- Covers for books typed by hand: they show the placeholder.

## Acceptance criteria

- [ ] A book's cover shows with the network off.
- [ ] A book with no cover ID shows the placeholder.
- [ ] Open Library's answer is recorded, and the switch is set by it.

## Questions for the brainstorm

1. **What if Open Library hasn't answered when the task closes?** D6 stores covers pending their word. Proposed: the switch stays on storing, and the task closes as `completed-as-partial`, with the answer left as a deferred item.
2. **Who sends the mail?** Proposed: the user, from a draft the task writes on its first day.
3. **Are cover fetches paced like the lookups?** Proposed: yes, through the pacing LKP-2 builds if it lands first; else one at a time.

## Documents to check on close

- [The MVP](../../MVP.md): M6's and M9's status.
- [The decisions](../../decisions/README.md): D6, once Open Library answers.

## Log

| Date | Event |
|---|---|
| 2026-11-07 | Written by the new sprint step. |
