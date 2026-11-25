# Sprint 2

Parent: [the architecture](../../ARCHITECTURE.md)

| | |
|---|---|
| Status | `open` |
| Opened | 2026-11-07 |
| Goal | A reader opens the updated Shelf offline, sees each book's cover with the network off, adds a pile of books without the lookups failing, and signs in to their shelves on a second device. |
| Capacity | 5.25 of about 10 to 15 dev-days |

## Scope

The sprint finishes the MVP and opens phase 1, across four modules: the app shell (`APP`), covers (`COV`), the lookup (`LKP`) and account and sync (`SYN`). It takes the fix for the rolled-back release 0.1.0, the deferred covers, and the open issue on Open Library's rate limit, then goes past the MVP's end, at the user's word, with P1.2. It holds 5.25 dev-days, 4.75 under the band of 10 to 15: the MVP's 1.25 left, two fixes of a day each, and P1.2's 2.

- APP-2 is the fix for release 0.1.0, rolled back on 2026-11-15: after the second visit, with the network off, the service worker served the old files, and then none. It comes first.
- COV-2 takes the deferred item, and keeps COV-1's merge of M6 and M9: M9, of a quarter day, follows M6 in the same module. It asks Open Library early, since their answer may be slow.
- LKP-2 takes the open issue on HTTP 429: the lookups are spaced and back off, and the reader sees a lookup waiting.
- SYN-1 takes P1.2 alone, ahead of P1.1, since the user chose it and it depends only on M1. Its first question names D11, the server, sign-in and sync transport, whose choice goes through the architecture.

## Board

| Task | Title | Story | Depends on | Days | Status |
|---|---|---|---|---|---|
| [APP-2](APP-2-service-worker-update.md) | Service worker serves the new shell offline after an update | M1 | — | 1 | `completed` |
| [COV-2](COV-2-stored-covers.md) | Covers stored on the device, with Open Library's word | M6, M9 | — | 1.25 | `completed` |
| [LKP-2](LKP-2-lookup-pacing.md) | Pace the lookups, back off on 429, and show a waiting lookup | M4 | — | 1 | `completed` |
| [SYN-1](SYN-1-sign-up-and-sign-in.md) | Sign up and sign in | P1.2 | APP-2 | 2 | `to-do` |

## Log

| Date | Event |
|---|---|
| 2026-11-07 | Opened by the new sprint step: APP-2, COV-2, LKP-2, SYN-1, 5.25 dev-days |
| 2026-11-07 | LKP-2 designed: [the design](../../plans/LKP-2-lookup-pacing-design.md), 1 dev-day, unchanged |
| 2026-11-08 | Build started by the build task step, on branch `app-2-service-worker-update`. |
| 2026-11-08 | APP-2 closed by the close task step: `completed`. |
| 2026-11-08 | APP-2's pull request, from `app-2-service-worker-update` into `main`, linked by the draft PR step: https://github.com/example/shelf/pull/2 |
| 2026-11-08 | Build started by the build task step, on branch `cov-2-stored-covers`. |
| 2026-11-09 | COV-2 closed by the close task step: `completed`. |
| 2026-11-09 | COV-2's pull request, from `cov-2-stored-covers` into `main`, linked by the draft PR step: https://github.com/example/shelf/pull/3 |
| 2026-11-09 | Build started by the build task step, on branch `lkp-2-lookup-pacing`. |
| 2026-11-10 | LKP-2 closed by the close task step: `completed`. |
| 2026-11-10 | LKP-2's pull request, from `lkp-2-lookup-pacing` into `main`, linked by the draft PR step: https://github.com/example/shelf/pull/4 |
