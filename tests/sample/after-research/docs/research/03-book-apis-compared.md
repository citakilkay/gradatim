# 03 · Compares Open Library and Google Books for Shelf's ISBN lookup

*Compared 2026-11-04 from [01](01-open-library.md) and [02](02-google-books.md), for which public book API Shelf uses for ISBN lookup. It decides nothing, and it adds no source.*

## Summary

Both APIs can return title, author names and a cover for an ISBN in one call from the browser, though Open Library's one-call endpoint is marked legacy (01 F2, 02 F2). They differ most on access and terms. Open Library needs no key and allows 1 to 3 requests a second, but it goes down with the Internet Archive (01 F13, 01 F14, 01 F16). Google Books failed every keyless call on the day of research, and quotas for one's own key are undocumented (02 F13, 02 F14). On storage, Open Library's data is CC0, and no rule on keeping covers on the device was found. Google's terms allow cached copies only as long as the cache header says, one day for covers (01 F19, 01 F8, 02 F7, 02 F19). Coverage is unmeasured for both: each has a large catalogue and reported misses (01 F9, 01 F10, 02 F8, 02 F10).

## The ideas side by side

| Question | Open Library | Google Books |
|---|---|---|
| Title, authors and cover in one call | Yes, with the legacy Books API; the ISBN API needs a second call for author names; search.json gives the work's cover, not the edition's (01 F2, 01 F3, 01 F4) | Yes, `volumes?q=isbn:` returns a list of volumes with title, authors, identifiers and image links (02 F1, 02 F2) |
| Cover sizes and access | S, M, L by plain URL, open CORS, cacheable for a century (01 F5, 01 F7) | Up to six sizes, often only two in search results; one-day cache header, no CORS header on the image (02 F5, 02 F7) |
| Cover rate limit | By ISBN, 100 per IP per 5 minutes; by cover ID, no limit (01 F6) | No documented limit on the image endpoint; not found (02) |
| Keeping covers and data offline | Data is CC0; whether covers may be stored on the device isn't said, and their rights aren't granted (01 F19, 01 F8, 01 F20) | Cached copies only as long as the cache header allows, deleted on termination (02 F7, 02 F19) |
| Catalogue size | Nearly 38M editions in 2022 (01 F9) | More than 40M scanned titles in 2019 (02 F8) |
| ISBN hits and data quality | About a third of editions lack an ISBN in one sample; six-ISBN spot check mostly found; missing ISBNs can be imported from Amazon (01 F10, 01 F11, 01 F12) | Reported misses and wrong editions; lowercase `isbn:` needed; results vary by country (02 F9, 02 F10, 02 F11) |
| Key | None needed; a User-Agent with contact for the higher tier (01 F13) | Required by the docs; keyless calls share one exhausted quota (02 F12, 02 F13) |
| Rate limits and quota | 1 request a second, 3 when identified (01 F14) | Undocumented for one's own key, with reports that disagree (02 F14) |
| Calls from the browser | Open CORS on API and covers (01 F15) | CORS on the API; a client key is public and should be restricted by referrer (02 F15) |
| Reliability | Offline for days in October 2024; recurring load trouble (01 F16, 01 F17) | 429s on keyless calls, and reported 429s at near-zero use (02 F13, 02 F14) |
| Cost and commercial use | Free; guidelines rule out high-traffic commercial backends (01 F21) | No price stated; no charging users without Google's permission (02 F16) |
| Attribution | A link back is appreciated, not required (01 F20) | "Powered by Google" and a Google Books link on each result; results unaltered (02 F17, 02 F18) |

## Risks, watch-outs and trade-offs

- **Trade-off:** Open Library gives keyless, browser-direct lookups with open data, at the cost of a legacy one-call endpoint and an Internet Archive dependency. Google Books gives one current endpoint, at the cost of a key, an unclear quota and branding duties (01 F2, 01 F16, 02 F13, 02 F17).
- **Risk:** Open Library and its covers can be offline for days when the Internet Archive is (01 F16, 01 F7).
- **Risk:** Google Books lookups can fail with 429s that Shelf can't fix, keyless or not (02 F13, 02 F14).
- **Watch out:** offline shelves keep covers and data on the device. Google's terms limit cached copies to the cache header, one day for covers. Open Library's pages are silent on covers (02 F7, 02 F19, 01 F8).
- **Watch out:** Open Library caps covers by ISBN at 100 per IP per 5 minutes; covers by cover ID aren't capped (01 F6).
- **Watch out:** using Google Books as a fallback behind Open Library runs into its rule against the Google logo beside competing services and against altered results (02 F18).
- **Watch out:** Open Library's limits sit on editable wiki pages, and Google's Books terms date from 2012; both should be read again before building (01 F18, 02 F16).

## Gaps

- No measured ISBN hit rate for either API, overall or for recent and non-English books. A sample of a few hundred ISBNs that Shelf's readers would likely add, run against both, would settle it (01 F11, 02 F10).
- No successful Google Books response was seen, so its result shape rests on the docs; a test with a restricted key would settle it (02).
- Whether storing covers in the reader's browser counts as a cached copy under Google's terms, or is allowed by the covers' rights at Open Library, is a legal reading neither report settles.
- The Internet Archive's live terms were not read (01).

## Notes
