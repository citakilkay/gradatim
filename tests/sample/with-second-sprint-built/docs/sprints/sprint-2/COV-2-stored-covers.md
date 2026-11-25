# COV-2 · Covers stored on the device, with Open Library's word

Parent: [sprint 2](README.md)

| | |
|---|---|
| Status | `completed` |
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

- [x] A book's cover shows with the network off. **Shown 2026-11-09:** `e2e/covers-offline.test.ts` adds a book with the network on, turns it off, reloads, and finds the cover.
- [x] A book with no cover ID shows the placeholder. **Shown 2026-11-09:** `BookCover.test.ts` renders the placeholder for a book with no cover ID, and for one typed by hand.
- [x] Open Library's answer is recorded, and the switch is set by it. **Shown 2026-11-09:** their answer of 2026-11-09 is in this task's log; `covers.test.ts` stores the Blob with the switch on, and the URL alone with it off; the switch is on.

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
| 2026-11-08 | Build started by the build task step, on branch `cov-2-stored-covers`. |
| 2026-11-08 | The mail to Open Library went out from the task's draft; the user sent it. |
| 2026-11-09 | Open Library answered: an app may keep the covers it shows on a reader's own device, with no bulk download. The switch stays on storing the image, as D6 says for a yes. |
| 2026-11-09 | Covers are fetched one at a time, since LKP-2's pacing isn't built yet, and stored as Blobs in `covers`; a book with no cover ID, or typed by hand, shows the placeholder. Shown by `npm test` and `npm run test:e2e`. |
| 2026-11-09 | What shows each criterion, for the close: 1. `e2e/covers-offline.test.ts` finds a book's cover after a reload with the network off · 2. `BookCover.test.ts` renders the placeholder · 3. Open Library's answer of 2026-11-09, in this log, and `covers.test.ts` with the switch on and off |
| 2026-11-09 | Built by the build task step, on branch `cov-2-stored-covers`. The close is next. |
| 2026-11-09 | Closed by the close task step: `completed`, every criterion shown. Review: no findings. Documents: none: D6 holds as written, since Open Library allows covers kept on the device. |
