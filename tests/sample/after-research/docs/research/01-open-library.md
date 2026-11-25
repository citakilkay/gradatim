# 01 · Can Open Library's API serve Shelf's ISBN lookup: title, author and cover from an ISBN, and on what coverage, limits and terms?

*Researched 2026-11-04 for which public book API Shelf uses for ISBN lookup (Open Library vs Google Books). It decides nothing. Depth: 5 sub-questions, 17 searches, 24 sources, 5 read in full. Tools: WebSearch, WebFetch, the check script's --quote and --text modes, curl for live API responses and headers. Missing: Firecrawl or Exa would have given clean full text of pages that scripts build or that a plain fetch couldn't reach (the Internet Archive's terms at archive.org/about/terms.php, a 2025 paper comparing Google Books and Open Library metadata, a 2024 outage report that returned 404), and search that returns page content, such as the openlibrary repo's nginx rate-limit config. Quotes: 32 of 32 found on their pages on 2026-11-04.*

## Summary

Open Library answers an ISBN lookup without a key, and one call to the legacy Books API (`/api/books?jscmd=data`) returns title, author names and cover URLs together; the newer ISBN API returns author keys only, so it takes a second request for names (F1, F2, F3). Covers come by plain URL in three sizes; lookups by ISBN are capped at 100 per IP per 5 minutes, lookups by cover ID are not, and cover images are served long-cacheable from archive.org (F5, F6, F7). The catalogue is large (nearly 38M editions in 2022) and a small spot check found recent and non-English titles, but about a third of editions carry no ISBN and imported records are of uneven quality (F9, F10, F11, F12). Rate limits are 1 request per second, 3 when identified; CORS is open; the October 2024 Internet Archive attacks took it offline for days (F14, F15, F16, F17). The data is CC0, but the usage guidelines say the API is not meant as a backend for high-traffic commercial services, and the covers carry their own rights (F19, F20, F21, F22).

## Findings

### What does an ISBN lookup return: which endpoints (Books API, ISBN API /isbn/{isbn}.json, search), and do title, author names and a cover come back in one call or several (e.g. author keys needing a second request)?

- **F1.** Open Library documents five ways to get book data: the Search API (marked preferred), the Works and Editions APIs, the ISBN API and the generic Books API; the ISBN API accepts ISBN-10 or ISBN-13 and redirects to the edition record, and `.json` returns it as data. [2] Confidence: medium, one source.
  > "Instead of "/books", a path of "/isbn" is used, followed by a valid ISBN 10 or 13." [2]
- **F2.** The Books API with `jscmd=data` returns, per ISBN, the title, the authors as names with URLs, and small, medium and large cover URLs, so one call gives all three fields Shelf needs; several ISBNs can go in one request. It is marked legacy and may be phased out. [2] Confidence: medium, one source.
  > "Please consider using the Book Search API above; this is a legacy endpoint and may be phased out in the future." [2]
  > "The API supports both ISBN 10 and 13." [2]
- **F3.** The ISBN API's JSON gives the title and cover IDs but the authors only as keys (`{"key": "/authors/OL34184A"}`), so author names need a second request to the Authors API; observed live for ISBN 9780140328721. [3][1] Confidence: high.
- **F4.** `search.json?isbn=…&fields=title,author_name,cover_i` returns title, author names and a cover ID in one call; in the live test it returned the work's title and cover ("Fantastic Mr Fox", cover 6498519), not the edition's (cover 15152634 in F3), so the cover can differ from the copy the reader holds. [4][3] Confidence: medium, one source.

### Covers: how are cover images got (Covers API, sizes), what are their limits (rate limits on cover by ISBN vs by cover ID), and can the app cache/store them for offline use?

- **F5.** Covers are plain image URLs, `covers.openlibrary.org/b/$key/$value-$size.jpg`, keyed by cover ID, OLID, ISBN, OCLC or LCCN, in sizes S, M and L; by default a missing cover returns a blank image, and `?default=false` returns a 404 instead. [5] Confidence: medium, one source.
  > "By default it returns a blank image if the cover cannot be found." [5]
- **F6.** Lookups by ISBN (any key other than cover ID or OLID) are limited to 100 per IP every 5 minutes, with a 403 beyond that; lookups by cover ID are not limited, which is why the Books API's cover-ID URLs avoid the limit. [5][6] Confidence: high.
  > "Currently only 100 requests/IP are allowed for every 5 minutes." [5]
  > "If any IP tries to access more that the allowed limit, the service will return "403 Forbidden" status." [5]
  > "The limit is applicable only for cover accesses by various identifiers and there is no limit of accessing covers by cover ID." [6]
- **F7.** A cover by ID came back with `access-control-allow-origin: *`, `cache-control: public` and an `expires` header a century ahead; a cover by ISBN came back as a 302 redirect to an image inside a zip on archive.org, so covers depend on archive.org being up. [24] Confidence: medium, one source.
- **F8.** The docs ask apps to hotlink covers from covers.openlibrary.org on public pages, to not crawl the Covers API, and say bulk covers are on archive.org; the general guidelines ask apps to cache responses. Neither page says whether an app may keep cover images on the device for offline use. [5][1][7] Confidence: medium, one source each.
  > "If you want to display covers on public-facing pages, please use a src URL that points to covers.openlibrary.org." [5]
  > "Please, do not crawl our cover API ." [5]
  > "Cache responses whenever possible" [1]

### Coverage and data quality: how many editions/ISBNs, how well does it cover ISBN-10/13, non-English and recent books; known gaps or errors.

- **F9.** The catalogue held nearly 38M editions at the end of 2022, the last count found from Open Library itself. [9] Confidence: medium, one source.
  > "Our book catalog expanded to nearly 38M editions and we cleaned up nearly 230k low quality records." [9]
- **F10.** In a 1% sample analysed by an independent author, 64% of editions had an ISBN-10 or ISBN-13, and about 70% were imported from outside sources. [10] Confidence: low, one secondary source.
  > "64% of editions have at least one ISBN 10 or ISBN 13 (this is asked for in manual uploads, or an LCCN)" [10]
- **F11.** A spot check of six ISBNs through the Books API on 2026-11-04 found title, author and cover for a 2024 and a 2025 English novel, a Turkish edition and a French one; one German ISBN was not found. Six ISBNs say little about coverage at scale. [8] Confidence: low, one source, small sample.
- **F12.** A missing ISBN can sometimes be imported on demand through `/isbn/:identifier`, which looks the book up at Amazon through Open Library's affiliate server; an Open Library reply in a Zotero thread says Amazon and BetterWorldBooks imports aren't the best quality. [11][12][13] Confidence: medium.
  > "If you know the ISBN or ASIN of a book that is missing from Open Library, you may be able to import it "automagically" using the https://openlibrary.org/isbn/:identifier: API." [11]
  > "second from Amazon via the affiliate server." [12]
  > "If you see any consistent/systemic issues (we know Amazon and BWB imports aren't the best quality) please do flag it for us to look at via openlibrary@archive.org" [13]

### Access, rate limits and reliability: API key needed? documented rate limits, User-Agent requirements, uptime/outages (e.g. the 2024 Internet Archive outages), CORS from a browser.

- **F13.** No API key is needed; the docs ask frequent callers to send a User-Agent naming the app with a contact e-mail or phone number. [1][2] Confidence: high.
  > "If your application will make regular, frequent use of Open Library's APIs (e.g. multiple calls per minute), please add a HEADER that specifies a User-Agent string with (a) the name of your application and (b) your contact email or phone number, so we may contact you when we notice high request volume." [1]
- **F14.** The documented rate limits are 1 request per second unidentified and 3 per second identified, and violations may lead to aggressive rate limiting or blocking; the guidelines also ask apps not to make hundreds of single-book requests and to use search.json for batches. [1] Confidence: medium, one source.
  > "In addition, identified requests will enjoy a 3x request limit." [1]
  > "Violations may result in aggressive rate limiting or blocking." [1]
  > "Make hundreds of single-book requests (use search.json for batch results)" [1]
- **F15.** The Books API, search.json and the covers host all answered a request carrying an `Origin` header with `access-control-allow-origin: *`, so a browser can call them directly. [8][4][24] Confidence: medium, one primary source per endpoint.
- **F16.** After the October 2024 cyberattacks the Internet Archive took openlibrary.org offline; archive.org came back read-only on October 21, and a DDoS also hit Open Library's availability. [14][15][16][17] Confidence: high.
  > "As a result, we took archive.org and openlibrary.org offline over the past few days to examine and strengthen our services—the Wayback Machine is now back online in a read-only view, and our blog and Mastodon have returned." [14]
  > "The DDoS attack that followed the hacker’s message affected the availability of not only the Wayback Machine but also the nonprofit’s Open Library book archive." [15]
  > "In coming days more services will resume, some starting in read-only mode as full restoration will take more time." [17]
- **F17.** Load problems recur outside that outage: Open Library cut search.json's default fields in January 2025 after many 500 errors, logs incidents as GitHub postmortem issues, and SearXNG's docs warn the service is sometimes slow. [18][23][19] Confidence: medium.
  > "Reasoning: Our performance monitoring at Open Library has shown a high number of 500 responses related to search engine solr performance." [18]
  > "In 2022, we migrated our process to use Postmortem Issues on github." [23]
  > "The service sometimes takes a very long time to respond, the timeout may" [19]
- **F18.** The API docs are wiki pages anyone signed in can edit: the developers page was last edited on 2026-10-30 by a user account, so a limit read there can change without an announcement. [1] Confidence: medium, one source.

### Terms and cost: licence of the data and covers, attribution requirements, commercial use, caching/storing data, any cost.

- **F19.** The catalogue data is open: the Internet Archive asserts no new rights over it, contributions are asked under CC0, and monthly dumps are free. [20][21][1] Confidence: high.
  > "The Internet Archive does not assert any new copyright or other proprietary rights over any of the material in the Open Library database." [20]
  > "We ask that any and all contributions you make to Open Library be given under the following Creative Commons license: CC0 1.0 Universal license ." [21]
- **F20.** The same licensing page warns of existing rights on some contributions; covers are mostly publishers' jacket art, and no page found grants a licence to them. A courtesy link back to Open Library is appreciated, not required. [20][5] Confidence: medium.
  > "There may be existing rights issues on some contributions and in some jurisdictions." [20]
  > "A courtesy link back to Open Library is appreciated, whether it be on each individual book's page (where you can link back to the book's page on Open Library, for example, using the same ISBN https://openlibrary.org/isbn/9780385533225 ), or on your About page or in your footer." [5]
- **F21.** The usage guidelines put open-source, mission-aligned and human-facing lookup tools first, and say the APIs are not meant as a bulk backend or high-traffic commercial infrastructure; the API costs nothing. [1] Confidence: medium, one source.
  > "These APIs are not intended to serve as a bulk data backend or high-traffic commercial infrastructure." [1]
  > "Make useful, time-sensitive requests on behalf of human users" [1]
- **F22.** Open Library's footer links its terms of service to the Internet Archive's terms, which Yale's counsel's office summarises as for scholarship and research only; the live terms page couldn't be read. [1][22] Confidence: low, one secondary source.
  > "Content: Internet Archive is a non-profit library of millions of free books, movies, software, music and websites for scholarship and research purposes only." [22]

## The options

- **Open Library, Books API (`/api/books?jscmd=data`) per ISBN:** for it, one call gives title, author names and cover-ID URLs that skip the cover rate limit (F2, F6), no key, open CORS (F13, F15), CC0 data, no cost (F19); against it, marked legacy and may be phased out (F2), 1 to 3 requests per second (F14); what it would mean for the project, one fetch per added book from the browser, with the cover URL stored with the book.
- **Open Library, ISBN API (`/isbn/{isbn}.json`) plus Authors API:** for it, the current edition endpoint, edition-exact cover IDs, on-demand import of missing ISBNs (F1, F3, F12); against it, two requests per book or more with several authors (F3), counting twice against the rate limit (F14); what it would mean, a small chain of requests per added book.
- **Open Library, search.json by ISBN:** for it, the endpoint the docs prefer, one call with names and a cover ID (F1, F4), and the guidelines point batches there (F14); against it, the work's cover and title can differ from the edition's (F4), and search has had load trouble (F17); what it would mean, a lookup that may show a different cover from the reader's copy.
- **Google Books:** researched in a sibling report; the comparison follows.

## Risks, watch-outs and trade-offs

- **Risk:** Open Library and its covers go down when the Internet Archive does, for days at a time as in October 2024; covers by ISBN are served from archive.org itself (F7, F16, F17).
- **Risk:** the Books API, the one call that gives all three fields, is marked legacy and may be phased out (F2).
- **Risk:** a missing or wrong record, about a third of editions without an ISBN in one sample, and weaker Amazon and BWB imports (F10, F11, F12).
- **Watch out:** covers by ISBN are capped at 100 per IP per 5 minutes with a 403 beyond; a reader importing a list could hit it, covers by cover ID are not capped (F6).
- **Watch out:** the identified tier needs a User-Agent with an e-mail or phone number; whether a browser app can set that header, rather than a server in front of it, is an inference not checked here (F13, F14).
- **Watch out:** the usage guidelines rule out high-traffic commercial backends, and the linked Internet Archive terms are summarised as for scholarship and research; storing covers offline isn't addressed and the covers' own rights aren't granted (F8, F20, F21, F22).
- **Watch out:** the API docs are editable wiki pages, so the limits above should be read again before building (F18).
- **Trade-off:** search.json is preferred and batches, but returns the work's cover; the ISBN API is edition-exact but needs a second call for authors; the Books API gives both in one call but is legacy (F2, F3, F4).

## Gaps

- No current edition or ISBN count: the latest Open Library figure is from 2022 (F9); a count from the monthly dumps would settle it.
- Coverage of non-English and recent books rests on a six-ISBN spot check (F11); a sample of a few hundred ISBNs from Shelf's likely readers, run against both APIs, would settle it. A 2025 paper comparing Google Books and Open Library for UK and Lithuanian books was found but its text couldn't be reached.
- The live Internet Archive terms (archive.org/about/terms.php) are built by script and couldn't be read; whether they bind API use, and what they say about commercial use, is open.
- Whether an app may store cover images on the device for offline use isn't said anywhere found; Open Library could be asked at openlibrary@archive.org.
- The exact date Open Library came back after October 2024 wasn't found in a primary source.
- The nginx config that enforces the rate limits, which the docs point to, wasn't read.

## Sources

1. [APIs](https://openlibrary.org/developers/api), Open Library. Primary. Updated 2026-10-30. Checked 2026-11-04; read in full.
2. [Books API](https://openlibrary.org/dev/docs/api/books), Open Library. Primary. Updated 2025-05-06. Checked 2026-11-04; read in full.
3. [ISBN API response for 9780140328721](https://openlibrary.org/isbn/9780140328721.json), Open Library. Primary. No date. Checked 2026-11-04.
4. [search.json response for ISBN 9780140328721](https://openlibrary.org/search.json?isbn=9780140328721&fields=title,author_name,cover_i), Open Library. Primary. No date. Checked 2026-11-04.
5. [Open Library Covers API](https://openlibrary.org/dev/docs/api/covers), Open Library. Primary. Updated 2024-08-13. Checked 2026-11-04; read in full.
6. [Coverstore Improvements](https://blog.openlibrary.org/2011/04/27/coverstore-improvements/), Open Library blog. Primary. Updated 2011-04-27. Checked 2026-11-04.
7. [Data Dumps](https://openlibrary.org/developers/dumps), Open Library. Primary. No date. Checked 2026-11-04.
8. [Books API responses, spot check of six ISBNs](https://openlibrary.org/api/books?bibkeys=ISBN:9789753638029&jscmd=data&format=json), Open Library. Primary. No date. Checked 2026-11-04.
9. [2022 Review](https://blog.openlibrary.org/2022/11/23/2022-review/), Open Library blog. Primary. Updated 2022-11-23. Checked 2026-11-04.
10. [What's in Open Library Data](https://www.skeptric.com/openlibrary-exploration), skeptric. Secondary. No date. Checked 2026-11-04.
11. [Data Importing](https://docs.openlibrary.org/advanced/data-importing.html), Open Library docs. Primary. No date. Checked 2026-11-04.
12. [Pull request #8690](https://github.com/internetarchive/openlibrary/pull/8690), internetarchive/openlibrary on GitHub. Primary. No date. Checked 2026-11-04.
13. [Feature request: Fall back to Open Library for ISBN lookup](https://forums.zotero.org/discussion/comment/518857/), Zotero Forums. Secondary. No date. Checked 2026-11-04.
14. [Letter from the Internet Archive: "Update: Cyberattacks on the Internet Archive"](https://erkansaka.net/2024/10/17/letter-from-the-internet-archive-update-cyberattacks-on-the-internet-archive), erkansaka.net, reposting the Internet Archive's letter. Secondary. Updated 2024-10-17. Checked 2026-11-04.
15. [Internet Archive cyberattack report](https://siliconangle.com/?p=673805), SiliconANGLE. Secondary. Updated 2024-10-10. Checked 2026-11-04.
16. [Internet Archive Services Update: 2024-10-21](https://blog.archive.org/2024/10/21/internet-archive-services-update-2024-10-21/), Internet Archive Blogs. Primary. Updated 2024-10-21. Checked 2026-11-04; read in full.
17. [Internet Archive Services Update: 2024-10-17](https://blog.archive.org/2024/10/18/internet-archive-services-update-2024-10-17/), Internet Archive Blogs. Primary. Updated 2024-10-18. Checked 2026-11-04.
18. [API Search.json Performance Tuning](https://blog.openlibrary.org/2025/01/16/api-search-json-performance-tuning/), Open Library blog. Primary. Updated 2025-01-16. Checked 2026-11-04.
19. [Open Library engine](https://docs.searxng.org/dev/engines/online/openlibrary.html), SearXNG docs. Secondary. No date. Checked 2026-11-04.
20. [Licensing](https://openlibrary.org/developers/licensing), Open Library. Primary. Updated 2021-06-27. Checked 2026-11-04; read in full.
21. [Using Open Library FAQ](https://openlibrary.org/help/faq/using), Open Library. Primary. No date. Checked 2026-11-04.
22. [Internet Archive](https://ogc.yale.edu/ogc/internet-archive), Yale Office of the General Counsel. Secondary. No date. Checked 2026-11-04.
23. [Disaster History Log](https://www.github.com/internetarchive/openlibrary/wiki/Disaster-History-Log), internetarchive/openlibrary wiki on GitHub. Primary. No date. Checked 2026-11-04.
24. [Cover image response, cover ID 6498519](https://covers.openlibrary.org/b/id/6498519-M.jpg), Open Library Covers. Primary. No date. Checked 2026-11-04.

## Notes

- Sources 3, 4, 8 and 24 are live API responses read with curl on 2026-11-04 (headers and JSON), so the findings resting on them carry no sentence to quote. The spot check in F11 used ISBNs 9780374602635, 9789753638029, 9783446273771 (not found), 9782070368228, 9780593798430 and 0140328726.
