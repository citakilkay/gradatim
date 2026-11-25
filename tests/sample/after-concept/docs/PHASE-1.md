# Shelf · Phase 1

*The concept step's phase 1, written on 2026-11-06. It rests on D3, D7 and D9 ([the decisions](decisions/README.md)).*

Phase 1 completes the idea: the count of books finished this year, and shelves that catch up across devices. It starts once the MVP is done, and ends when a reader sees how many books they finished this year, and a book added offline on one device shows on another once both are online.

### P1.1 · Books finished this year

Status: `planned` · Estimate: 0.5 dev-days · Depends on: M8 · Decisions: D7

A reader sees how many books they finished this calendar year, counted by each book's finished date. Done when the count matches the books whose finished date falls in this year, edited dates included.

### P1.2 · Sign up and sign in

Status: `planned` · Estimate: 2 dev-days · Depends on: M1 · Decisions: D3

A reader makes an account and signs in, and the shelves on their device become theirs. Done when a reader signs in on a second device.

### P1.3 · Shelves sync across devices

Status: `planned` · Estimate: 3 dev-days · Depends on: P1.2, M2, M3, M7 · Decisions: D3, D9

The shelves and books on the device sync with the server whenever it is online, and when two devices change the same book, the later change wins. Done when a book moved offline on one device shows on its new shelf on another, once both are online.

## Change log

| Date | Change |
|---|---|
| 2026-11-06 | Written by the concept step: P1.1 to P1.3 |
