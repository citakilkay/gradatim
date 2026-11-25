# LKP-2 · Pace the lookups, back off on 429, and show a waiting lookup: design

*The design of task [LKP-2](../sprints/sprint-2/LKP-2-lookup-pacing.md), for M4. Written by the design task step on 2026-11-07.*

## The idea

- Every request LKP sends to Open Library, the ISBN call and each Authors call alike, passes one shared gate that lets at most one through a second, as the architecture's seam to Open Library says (D2).
- A 429 holds the gate for the time in `Retry-After`, or for the queue's backoff when no `Retry-After` is sent, and the lookup stays in the queue until it is filled in, so no book is lost to the rate limit (D4).
- The shelf shows how many of its books are still looking up, as a count at the top of the shelf, and shows no mark on each book (decision 1).
- It takes `2026-11-10-LKP-1-open-library-rate-limit.md`: in LKP-1's build, a batch of lookups got HTTP 429 after the first few, since the queue sent them as fast as the device was online, while Open Library asks for one request a second (D1).
- The build first finds why the queue sent requests as fast as the device was online, with a test that fails, and then fixes the pacing in the worker (chosen for the user).
- The backoff keeps LKP-1's rule: it never gives up on errors or on a 429, with the wait capped at an hour, and only a 404 ends a lookup (chosen for the user).

## The user's decisions

1. **A count of waiting lookups at the top of the shelf, such as "3 books looking up", which goes away when nothing is waiting.** *Over:* a "looking up" mark on each waiting book, as the task proposed, with or without the ISBN beside it. A waiting book has no title yet, so a mark would have nothing to sit beside.

## Steps

### 1. A failing test that shows the pacing broken

- A unit test runs a batch of 20 lookups against recorded responses, with Open Library stubbed to answer 429 to any request that comes less than a second after the one before it, and records when each request goes out.
- The build traces why the worker sends faster than one a second (for example, a gate that covers only the ISBN call, or a timer reset on each online event) and notes the cause in the task's log.

**Done when:** the test fails on the current code, showing requests less than a second apart, and the cause is named.

### 2. One gate for every request, at most one a second

- LKP's client sends each request, the ISBN call and every Authors call, through a single gate, so only one request is in flight at a time and each starts at least one second after the one before it started.
- The gate holds across online and offline changes and across the queue waking again, so going online again doesn't send a burst.

**Done when:** step 1's test passes, and no two recorded requests go out less than a second apart.

### 3. Back off on 429, honouring `Retry-After`

- On a 429, the gate holds every request until `Retry-After` has passed, read as a number of seconds or as an HTTP date. With no `Retry-After`, or one that can't be read, the queue's backoff applies, capped at an hour.
- The lookup that got the 429 stays in the queue with its tries and next try updated, and is sent again when the wait ends. The book stays `pending`.
- A 404 still marks the book `not-found`, and other errors keep LKP-1's backoff.

**Done when:** unit tests show the next request after a 429 waits for `Retry-After` in seconds, for `Retry-After` as a date, and for the backoff when the header is missing, and the batch of 20 fills in every book.

### 4. The count of waiting lookups on the shelf

- The shelf view reads, through a live query in LKP's or BOK's own functions, how many of the shelf's books have `lookup` set to `pending`.
- While that number is above zero, the top of the shelf shows "1 book looking up" or "N books looking up". At zero the line goes away.
- A waiting book shows on the shelf as it does now, with no mark of its own.

**Done when:** a component test shows the count with 3 pending books, the singular with 1, the count dropping as a lookup is found or not found, and no line at 0.

## Acceptance criteria

| # | Criterion | Step | Shown by |
|---|---|---|---|
| 1 | A batch of 20 lookups, with Open Library stubbed to answer 429 past one a second, fills in every book: a unit test on recorded responses. | 1, 2, 3 | The unit test of the batch of 20 |
| 2 | After a 429, the next request waits for `Retry-After`, or for the backoff. | 3 | Unit tests on `Retry-After` in seconds, as a date, and missing |
| 3 | The shelf shows how many of its books are waiting for a lookup, such as "3 books looking up", and shows nothing when none are waiting: a component test. | 4 | The component test of the shelf's count |

## The estimate

1 dev-day: unchanged. M4's figure was 2 dev-days, delivered by LKP-1; this task fixes the pacing that M4 asked for.

## Documents

**With this design:** the Design row in the task's header; criterion 3 changed in the task, marked; a log row in the task and in the sprint's README. The days don't move.

**At the close:** [the architecture](../ARCHITECTURE.md)'s Seams, for the gate shared by the ISBN and Authors calls and for `Retry-After`; its Seams for the views and the data, if the count reads through a new function.

## Watch for

- Timers in the tests: the build uses Vitest's fake timers, so the batch of 20 runs fast and the one-second spacing is exact, not flaky.
- `Retry-After` can be seconds or an HTTP date (RFC 9110, section 10.2.3), and a browser can read it only if Open Library's CORS headers expose it. The build checks a live 429's headers before it relies on reading the header, and falls back to the backoff when the header can't be read.
- The count must include books waiting offline, not only those whose lookup is in flight, since every `pending` book has no title yet.

## Change log

| Date | Change |
|---|---|
| 2026-11-07 | Written by the design task step. |
