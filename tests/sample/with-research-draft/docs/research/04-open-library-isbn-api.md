# 04 · What does Open Library's API offer for looking up a book by ISBN (title, author, cover), and what limits it?

*Researched 2026-11-04 for which book-metadata source (and how) Shelf uses for ISBN lookup. It decides nothing. Replaces [01](01-open-library.md). Depth: 5 sub-questions, 11 searches, 30 sources (4 of them live API calls), 3 read in full. Tools: Exa search and fetch, the check script's --text and --quote modes, curl against the live API. Missing: nothing; the Internet Archive Terms of Use page could not be read as text by any tool (see Gaps). Quotes: 27 of 29 found on their pages on 2026-11-04; 2 not reached.*

## Summary

Open Library offers three keyless, read-only ways to resolve an ISBN: `/isbn/{isbn}.json`, the Books API with `jscmd=data`, and `search.json` with an `isbn:` query (F1–F5). Covers come from a separate Covers API in three sizes, rate-limited by ISBN but not by cover ID, and a missing cover returns a 1×1 image unless `?default=false` is set (F6–F9). The usage policy asks for caching, a User-Agent with contact details, and low, human-driven volume, with 1 request per second unidentified (F10–F13). The catalogue data is CC0; the licence of cover images is not stated in the sources read (F14–F15). JSON endpoints and covers send `Access-Control-Allow-Origin: *`, but rate-limit responses do not (F16–F18). Coverage is high for English-language books and much thinner elsewhere, with duplicates and junk records, and the service was fully down for about two weeks in October 2024 (F19–F25).

## Findings

### Endpoints and response shapes for an ISBN lookup

- **F1.** `/isbn/{isbn}` accepts an ISBN-10 or ISBN-13 and redirects to the edition record; adding `.json` returns the edition as JSON. Observed on 2026-11-04: `/isbn/9780140328721.json` answered 302 to `/books/OL7353617M.json`, then 200 with the edition, whose `authors` holds only keys (`/authors/OL34184A`) and whose `covers` holds cover IDs (`[15152634, 8739161, -1]`), so an author's name needs a second request. An unknown ISBN answered 404 with an HTML body. [1][26] Confidence: high.
  > "Instead of "/books", a path of "/isbn" is used, followed by a valid ISBN 10 or 13." [1]
- **F2.** The Books API (`/api/books?bibkeys=ISBN:…&jscmd=data&format=json`) takes one or more ISBN-10/13, OCLC, LCCN or OLID keys and returns, per matched key, `title`, `subtitle`, `authors` with names, `identifiers`, `publishers`, `publish_date`, `number_of_pages` and a `cover` object with small, medium and large URLs. Without `format=json` it returns JavaScript. Observed on 2026-11-04: the sample ISBN returned author names inline; an unknown ISBN returned `{}` with status 200. [1][27] Confidence: high.
  > "The API supports both ISBN 10 and 13." [1]
  > "It is advised to use jscmd=data instead of this as that is more stable format." [1]
- **F3.** Open Library's own docs point to the Search API as the general-purpose endpoint, and maintainers recommend `search.json?q=isbn:…` for batches of ISBNs, with a `fields` parameter to trim the response. Observed on 2026-11-04: `search.json?q=isbn:9780140328721&fields=key,title,author_name,cover_i,isbn` returned the work with `author_name` and a `cover_i` (6498519) that differs from the edition's own cover IDs, and an `isbn` list holding every edition's ISBNs. [1][2][13][28] Confidence: high.
  > "If you are looking for a single API to meet all of your book needs, it's likely the Book Search API ." [1]
- **F4.** Open Library separates a Work from its Editions; the ISBN, publisher and book jacket belong to the Edition, so the title, cover and author can differ between the edition record and the work-level search result (F3). [1] Confidence: medium, one source.
  > "Work metadata will include general umbrella information about a book, whereas an Edition will have a publisher, an ISBN, a book-jacket, and other specific information." [1]
- **F5.** When an ISBN is not in the catalogue, `/isbn/` can try to import it on demand from a commercial source (Amazon Products API via the "BookWorm" affiliate server), returning the new edition only with `high_priority=true`; otherwise it stages the record and still answers 404. The docs say this may be switched off as of 2025-03. [21][22] Confidence: medium; the docs themselves are unsure whether it is live.
  > "As of 2025-03, its possible the Bookworm (i.e. affiliate) Service is not enabled for importing by ISBN." [21]

### Cover images

- **F6.** Covers are served at `https://covers.openlibrary.org/b/{key}/{value}-{S|M|L}.jpg`, where the key is ISBN, OCLC, LCCN, OLID or a cover ID. [3] Confidence: medium, one source; observed working on 2026-11-04.
  > "key can be any one of ISBN, OCLC, LCCN, OLID and ID (case-insensitive)" [3]
- **F7.** Cover requests by ISBN (any key other than cover ID or OLID) are limited to 100 per IP per 5 minutes, and an excess returns 403; requests by cover ID carry no such limit, and the Books API hands out cover-ID URLs for this reason. [3][4][24] Confidence: high.
  > "Currently only 100 requests/IP are allowed for every 5 minutes." [3]
  > "The limit is applicable only for cover accesses by various identifiers and there is no limit of accessing covers by cover ID." [4]
- **F8.** A missing cover returns a blank image by default; `?default=false` makes it a 404. Observed on 2026-11-04: an unknown ISBN's cover answered 200 with a 43-byte 1×1 GIF, and 404 with `?default=false`. A third-party test of 60 ISBNs found no cover for 9 of 53 books Open Library did know. [3][23] Confidence: high.
  > "If you append ?default=false to the end of the URL, then it returns a 404 instead." [3]
  > "Even with everything working, roughly one book in six will legitimately show the placeholder." [23]
- **F9.** The Covers API is meant for `<img src>` display on public pages, not crawling or bulk download; bulk covers sit on archive.org, and a courtesy link back is asked for. Observed on 2026-11-04: a cover by ID redirected (302) to archive.org, with `Expires` a century out on the redirect and `Cache-Control: public, max-age=10800` on the image; sample sizes were 180×275 (M) and 326×500 (L). [3] Confidence: medium, one source plus observation.
  > "If you want to display covers on public-facing pages, please use a src URL that points to covers.openlibrary.org." [3]
  > "The covers API is intended for displaying covers on public facing websites and not for bulk download." [3]

### Rate limits, User-Agent and usage policy

- **F10.** The published limit is 1 request per second for unidentified requests and 3 per second for requests whose User-Agent names the application and a contact e-mail or phone number. [2][7] Confidence: high.
  > "In addition, identified requests will enjoy a 3x request limit." [2]
- **F11.** The APIs are offered for low-volume, real-time lookups on behalf of people, with caching asked for, and not as a backend for third-party or high-traffic commercial services; violations may bring heavy rate limiting or blocking. [2][5][7] Confidence: high.
  > "Due to limited resources, they are not intended to serve as a data backend for third-party services." [2]
  > "Violations may result in aggressive rate limiting or blocking." [2]
  > "Our Web APIs are ideal for book services which need to make infrequent, real-time searches for specific books, their authors, and their availability." [5]
- **F12.** A maintainer says the API runs on the same application that serves the website, so it does not scale well, and that heavy networks get rate-limited or blocked. A 2022 issue saw intermittent 503s from `/search` under load. [7][25] Confidence: medium, primary but informal.
  > "If we notice lots of requests from certain networks, then we rate limit and sometimes block entirely." [7]
- **F13.** For bulk use, Open Library publishes monthly dumps (editions about 9.2 GB, works about 2.9 GB, authors about 0.5 GB, covers metadata about 70 MB) and asks that the API not be used to harvest metadata. [2][6] Confidence: high.
  > "Open Library provides dumps of all its data, generated every month." [6]
  > "Please do not use our APIs to bulk download metadata because this impacts our ability to serve patrons." [2]

### Licence and terms

- **F14.** The catalogue data is dedicated to the public domain, and contributions are taken under CC0 1.0. [8][9] Confidence: high.
  > "Our catalog was created by the generous donations of libraries who dedicated their data into the public domain ." [8]
  > "All rights to Open Library data are surrendered via CC0." [9]
- **F15.** The Covers API page asks for a courtesy link and for display through `covers.openlibrary.org`, but none of the pages read states a licence for the cover images themselves, which are mostly publishers' artwork. [3] Confidence: inference, from F9 and the absence of a statement in [3], [8].

### CORS and offline/caching suitability

- **F16.** The `.json` endpoints and `/api/` paths send `Access-Control-Allow-Origin: *`; the same URL without `.json` does not work cross-origin. Observed on 2026-11-04 on `/isbn/….json`, its redirect target, `/api/books` and `search.json`, along with `Access-Control-Max-Age: 86400`. [10][29] Confidence: high.
  > "try adding `.json` to the end of the url like this:" [10]
- **F17.** Cover images became CORS-readable in 2021, including the archive.org redirect targets. Observed on 2026-11-04: covers.openlibrary.org sent `*`, and the final archive.org image echoed the request's origin. [11] Confidence: high, with observation.
  > "All images should now be CORS-able thanks to #4689 🎉" [11]
- **F18.** When the nginx rate limiter answers 429, it sends no CORS header, so a browser app sees an opaque network error instead of a 429; the issue was still open, with a fix proposed, in October 2026. The "Partner API" (`/api/volumes/brief/…`) also lacks CORS. [12][13] Confidence: medium, one primary source each.
  > "As such, if someone is making a client side app they won't even be able to see it's a 429." [12]

### Coverage, data quality and reliability

- **F19.** In a 2022 analysis of the dump, 64% of editions had an ISBN-10 or ISBN-13, about a third had a cover, and 89% had authors; a sample of Amazon ASINs matched 94% of the time, but 20% matched more than one record. [17][18] Confidence: low, one secondary author.
  > "Trying to match each extracted ASIN with an Open Library record gives 94% matches; 20% with more than one match." [18]
- **F20.** A 2025 study found Open Library covered about 93.6% of a set of UK ISBNs but only about 31–32% of Lithuanian ISBNs, so coverage depends heavily on country and language. [19] Confidence: low, one secondary source.
  > "Open Library showed minimal change, with coverage around 31-32%." [19] (unverified: not reached)
- **F21.** Duplicate editions under one ISBN, author names in mixed orders, and garbled imported records are known; maintainers note that publishers reuse ISBNs. Observed on 2026-11-04: the dummy ISBN 9780000000002 resolved to a real-looking edition ("Kitab Jurumiyyah", `isbn_10: 0000000000`). [17][20] Confidence: medium.
- **F22.** A third-party test of 60 research-library ISBNs found Open Library's Books API answered 53 (88%), and that running six requests at a time cut the hit rate to 70% through transport errors. [23] Confidence: low, one secondary source.
- **F23.** After the October 2024 cyberattacks, openlibrary.org and all its APIs were offline from about 10 October; archive.org returned read-only on 21 October and Open Library came back in stages after that. [14][15][16][30] Confidence: high.
  > "The related openlibrary.org book-preservation website was still offline today." [14] (unverified: not reached)
  > "The Wayback Machine, Archive.org, Archive-it.org, and OpenLibrary.org came up in stages over the week after cyberattacks with some of the contributor features coming up over the last couple of weeks." [16]
- **F24.** No published uptime figure or SLA was found; the service is a non-profit's, run alongside its website (F12). [2][7] Confidence: inference, from F12 and F23.
- **F25.** For an app that must work offline, the API gives no offline mode of its own: what it allows is caching responses (asked for in [2]) and cover-by-ID URLs that are unthrottled and long-cacheable (F7, F9). [2][3] Confidence: inference, from F7, F9 and F11.

## The options

- **Books API (`/api/books?…&jscmd=data&format=json`):** for it, title, author names and cover-ID URLs in one request, several ISBNs per call, CORS (F2, F7, F16); against it, the docs and maintainers steer users to Search instead (F3), and an unknown ISBN is a silent `{}` (F2); for Shelf, one call per added book gives everything the idea names.
- **`/isbn/{isbn}.json` plus `/authors/{key}.json`:** for it, exact edition match and possible on-demand import (F1, F5); against it, two or more requests per book and a 404 HTML body on a miss (F1); for Shelf, more requests per lookup against a 1 req/s limit (F10).
- **`search.json?q=isbn:…&fields=…`:** for it, the endpoint maintainers recommend, batchable, CORS (F3, F16); against it, it returns the work, whose cover and title may not be the edition's (F3, F4); for Shelf, suits catching up several queued ISBNs at once after being offline.
- **Covers by ISBN URL vs by cover ID:** by ISBN needs no metadata call but is limited to 100 per 5 minutes per IP and returns a blank image on a miss (F7, F8); by ID is unthrottled and long-cacheable but needs the ID from a metadata call first (F7, F9).
- **Calling from the browser vs through Shelf's own server:** from the browser, CORS works and each reader's IP carries its own limit (F16, F17), but a 429 is unreadable (F18), and whether a browser lets the app send the identifying User-Agent was not checked (see Gaps); through a server, one User-Agent and cache serve everyone, but all readers share one IP's limit and the policy's caution on third-party backends applies (F10, F11).
- **A local subset of the monthly dump:** for it, CC0, no rate limits, works without the API (F13, F14); against it, gigabytes of data and monthly refreshes for a small app (F13).
- **Open Library with another source as fallback, or another source alone:** for it, coverage gaps by country and the 2024 outage (F20, F23); against it, more integration; other sources are outside this report.

## Risks, watch-outs and trade-offs

- **Risk:** a two-week outage like October 2024 would stop every new ISBN lookup and, if covers are hot-linked, every cover in the app (F23, F24).
- **Risk:** a lookup that hits the rate limit in a browser surfaces as a generic network error, indistinguishable from being offline (F18).
- **Risk:** a wrong or junk record comes back for an ISBN, or several records match one ISBN (F19, F21).
- **Watch out:** 1 request per second unidentified, 3 identified; identification asks for a contact e-mail or phone number in the User-Agent (F10).
- **Watch out:** covers by ISBN are capped at 100 per IP per 5 minutes, with a 403 on excess (F7).
- **Watch out:** a missing cover is a 200 with a 1×1 GIF unless `?default=false` is used (F8).
- **Watch out:** the usage policy is against serving as a backend for third-party or high-traffic commercial services (F11).
- **Watch out:** the on-demand import of missing ISBNs may be disabled (F5).
- **Trade-off:** caching covers and metadata locally serves the offline shelves and the policy's ask to cache, at the cost of storage and of the cover-image licence question (F9, F15, F25).
- **Trade-off:** work-level search results are easier to batch but may show a different cover or title from the reader's own edition (F3, F4).

## Gaps

- The Internet Archive Terms of Use (archive.org/about/terms.php), which the site footer links to, could not be read as text; what they say about API use and stored covers is unverified. Reading it in a browser would settle it.
- No source states a licence for cover images or whether storing them in an app's offline cache is allowed.
- No uptime figure or status page for the API was found; only incident reports.
- Whether a browser can set the identifying User-Agent header was not checked against the Fetch standard or browser behaviour.
- Coverage figures (F19, F20, F22) are small or old samples; a sample of the ISBNs Shelf's readers actually own would settle coverage for this project.
- Whether `high_priority=true` import is live in November 2026 was not tested.

## Sources

1. [Developer Center / APIs / Books API](https://openlibrary.org/dev/docs/api/books), Open Library. Primary. No date. Checked 2026-11-04; read in full.
2. [APIs](https://openlibrary.org/developers/api), Open Library. Primary. No date. Checked 2026-11-04; read in full.
3. [Open Library Covers API](https://openlibrary.org/dev/docs/api/covers), Open Library. Primary. Updated 2024-08-13. Checked 2026-11-04; read in full.
4. [Coverstore Improvements](https://blog.openlibrary.org/2011/04/27/coverstore-improvements/), Open Library blog. Primary. Updated 2011-04-27. Checked 2026-11-04.
5. [Developer Center](https://openlibrary.org/developers), Open Library. Primary. No date. Checked 2026-11-04.
6. [Open Library Data Dumps](https://openlibrary.org/developers/dumps), Open Library. Primary. No date. Checked 2026-11-04.
7. [Understanding Open Library API Rate Limits and Scaling, issue #10585](https://github.com/internetarchive/openlibrary/issues/10585), internetarchive/openlibrary on GitHub. Primary. Updated 2025-03-17. Checked 2026-11-04.
8. [Using Open Library Data](https://openlibrary.org/help/faq/using), Open Library. Primary. No date. Checked 2026-11-04.
9. [CC0 use for data](https://wiki.creativecommons.org/wiki/CC0_use_for_data), Creative Commons wiki. Secondary. No date. Checked 2026-11-04.
10. [CORS policy error when accessing openlibrary endpoints, issue #8407](https://github.com/internetarchive/openlibrary/issues/8407), internetarchive/openlibrary on GitHub. Primary. Updated 2023-10-11. Checked 2026-11-04.
11. [Address CORS issues with Covers API, issue #3399](https://github.com/internetarchive/openlibrary/issues/3399), internetarchive/openlibrary on GitHub. Primary. Updated 2021-03-05. Checked 2026-11-04.
12. [We should return CORs headers when we send a 429, issue #11140](https://github.com/internetarchive/openlibrary/issues/11140), internetarchive/openlibrary on GitHub. Primary. Updated 2026-10-24. Checked 2026-11-04.
13. [CORS errors on Partner API Single-request and Multi-request endpoints, issue #8768](https://github.com/internetarchive/openlibrary/issues/8768), internetarchive/openlibrary on GitHub. Primary. Updated 2025-01-31. Checked 2026-11-04.
14. [The Internet Archive and its 916 billion saved web pages are back online](https://arstechnica.com/tech-policy/2024/10/the-internet-archive-and-its-916-billion-saved-webpages-are-back-online/), Ars Technica. Secondary. Updated 2024-10-14. Checked 2026-11-04.
15. [Website not reachable, issue #9948](https://github.com/internetarchive/openlibrary/issues/9948), internetarchive/openlibrary on GitHub. Primary. Updated 2024-10-14. Checked 2026-11-04.
16. [Open Library category: Learning from Cyberattacks](https://blog.archive.org/category/open-library/), Internet Archive Blogs. Primary. Updated 2024-11-14. Checked 2026-11-04.
17. [What's in Open Library Data](https://skeptric.com/openlibrary-exploration/), skeptric. Secondary. Updated 2022-07-22. Checked 2026-11-04.
18. [Open Library ISBN Lookup](https://skeptric.com/open-library-isbn-lookup/), skeptric. Secondary. Updated 2022-08-01. Checked 2026-11-04.
19. [Exploring Google Books, Open Library, and Wikipedia as Sources for Book Metadata: The UK and Lithuanian Cases](https://issi2025.iiap.sci.am/wp-content/uploads/2025/07/21%E2%80%A4-Dagiene_rp_issi2025_286.pdf), ISSI 2025 conference paper. Secondary. Updated 2025-07. Checked 2026-11-04.
20. [Merge orphaned editions w/ duplicate un-orphaned editions sharing same ISBN, issue #1048](https://github.com/internetarchive/openlibrary/issues/1048), internetarchive/openlibrary on GitHub. Primary. No date. Checked 2026-11-04.
21. [Data Importing](https://docs.openlibrary.org/advanced/data-importing.html), Open Library Docs. Primary. No date. Checked 2026-11-04.
22. [Re-enable Amazon imports from /isbn, PR #8690](https://github.com/internetarchive/openlibrary/pull/8690), internetarchive/openlibrary on GitHub. Primary. Updated 2024-02. Checked 2026-11-04.
23. [METADATA-SOURCES.md](https://git.jfmonty2.com/jfmonty2/bookshelf/raw/branch/main/docs/METADATA-SOURCES.md), jfmonty2/bookshelf project notes. Secondary. No date. Checked 2026-11-04.
24. [Open Library Covers API Rate Limit](https://stackoverflow.com/questions/43091801/open-library-covers-api-rate-limit), Stack Overflow. Secondary. Updated 2017-03-29. Checked 2026-11-04.
25. [503 on dev device, issue #6804](https://github.com/internetarchive/openlibrary/issues/6804), internetarchive/openlibrary on GitHub. Primary. Updated 2022. Checked 2026-11-04.
26. [Live call: /isbn/9780140328721.json](https://openlibrary.org/isbn/9780140328721.json), Open Library. Primary. Observed with curl and a plain user agent. Checked 2026-11-04.
27. [Live call: /api/books for ISBN 9780140328721, jscmd=data](https://openlibrary.org/api/books?bibkeys=ISBN:9780140328721&jscmd=data&format=json), Open Library. Primary. Observed with curl. Checked 2026-11-04.
28. [Live call: search.json for isbn:9780140328721](https://openlibrary.org/search.json?q=isbn:9780140328721&fields=key,title,author_name,cover_i,isbn&limit=1), Open Library. Primary. Observed with curl. Checked 2026-11-04.
29. [Live call: covers by ISBN, medium](https://covers.openlibrary.org/b/isbn/9780140328721-M.jpg), Open Library. Primary. Observed with curl, with an Origin header. Checked 2026-11-04.
30. [Internet Archive Services Update: 2024-10-21](https://blog.archive.org/2024/10/21/internet-archive-services-update-2024-10-21/), Internet Archive Blogs. Primary. Updated 2024-10-21. Checked 2026-11-04.

## Notes
