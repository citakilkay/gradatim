# 02 · Can the Google Books API serve Shelf's ISBN lookup: title, author and cover from an ISBN, and on what coverage, limits and terms?

*Researched 2026-11-04 for which public book API Shelf uses for ISBN lookup (Open Library vs Google Books). It decides nothing. Depth: 5 sub-questions, 8 searches, 20 sources, 7 read in full. Tools: WebSearch, the check script's --text and --quote modes, and curl for keyless test calls to the API and the cover endpoint (no key, no sign-in, a plain user agent). Missing: Firecrawl or Exa would have given clean full text of the Stack Overflow threads (stackoverflow.com and its mirror refused a plain fetch, 403 and 401) and of the 2025 UK/Lithuania metadata paper (503), and a search that returns page content would have found a measured ISBN hit rate, if one exists; the Google Cloud console quota page needs a sign-in and was not opened. Quotes: 32 of 33 found on their pages on 2026-11-04; 1 not reached.*

## Summary

One keyless GET to `volumes?q=isbn:<n>` is documented to return title, authors, ISBN-10/13 identifiers and cover links together (F1, F2, F3). Covers come as Google-hosted URLs in up to six sizes, served with a one-day cache header, and Google's API terms forbid keeping copies longer than the cache header allows, which bears directly on offline shelves (F5, F6, F7). Google Books holds more than 40 million scanned titles, but ISBN queries miss some valid books and can surface the wrong edition or cover, and results vary by country (F8, F9, F10, F11). On 2026-11-04 every keyless call failed with HTTP 429 on a shared project's daily quota, so in practice a key is needed; quotas for one's own key are undocumented and reported inconsistently (F12, F13, F14). The Books API's own terms forbid charging users without Google's permission, and the branding rules require "powered by Google" attribution, a link to Google Books per result, and unaltered results (F16, F17, F18).

## Findings

### What does an ISBN lookup return: which endpoint (volumes?q=isbn:…), and do title, author names and a cover come back in one call? What fields (volumeInfo, industryIdentifiers, imageLinks)?

- **F1.** The lookup is a search on `https://www.googleapis.com/books/v1/volumes` with the `isbn:` keyword in `q`; it returns a list of volumes, not a single record, so the app picks the item. [1][2] Confidence: high.
  > "isbn : Returns results where the text following this keyword is the ISBN number." [1]
- **F2.** Each volume's `volumeInfo` carries `title`, `authors[]`, `industryIdentifiers[]` and `imageLinks`, all in the "lite" projection, so title, author names and cover links come back in the same search call. [3] Confidence: medium, one source.
  > "The names of the authors and/or editors for this volume." [3]
  > "A list of image links for all the sizes that are available." [3]
- **F3.** `industryIdentifiers` lists the volume's identifiers by type, so the app can match the result back to the ISBN-10 or ISBN-13 it searched for. [3] Confidence: medium, one source.
  > "Possible values are ISBN_10, ISBN_13, ISSN and OTHER." [3]
- **F4.** The response can be trimmed with the `fields` parameter and gzip, and paged results are capped at 40 per call. [4][1] Confidence: medium, one source each.
  > "Partial response allows requesting only specific fields in the response using the fields parameter." [4]
  > "default is 10, and the maximum allowable value is 40." [1]

### Covers: how are cover images got (imageLinks thumbnail sizes, http vs https, zoom), what are their limits, and can the app cache/store them for offline use?

- **F5.** `imageLinks` offers up to six sizes, from ~80 to ~1280 pixels wide, but only the sizes that exist for the book; the search result is reported to carry mainly `smallThumbnail` and `thumbnail`, with larger sizes on the single-volume call or by changing the URL's `zoom` value. [3][5][6] Confidence: medium (primary for the sizes, forum and blog for the rest).
  > "Image link for small thumbnail size (width of ~80 pixels)." [3]
  > "Image link for thumbnail size (width of ~128 pixels)." [3]
  > "Image link for extra large size (width of ~1280 pixels)." [3]
- **F6.** The cover links are commonly returned as `http://` with `zoom=1&edge=curl`, and apps rewrite them to `https://`; a test fetch on 2026-11-04 showed the same image served over both http and https, with `zoom=3` giving a larger file (66,438 bytes against 12,655 for `zoom=1`). [6][7] Confidence: medium (one blog, one own observation).
  > "fix url to use https (default is http )" [6]
- **F7.** The cover endpoint answered with `Cache-Control: private, max-age=86400` (one day) and no `Access-Control-Allow-Origin` header, and the Google APIs Terms forbid permanent copies or cached copies kept longer than the cache header allows, unless the content owner permits it. Read together, storing covers for offline shelves beyond a day sits against the terms, and a browser can show the image but cannot read its bytes cross-origin without a proxy. [7][8] Confidence: inference, from F6 and the terms.
  > "Prohibitions on Content Unless expressly permitted by the content owner or by applicable law, you will not, and will not permit your end users or others acting on your behalf to, do the following with content returned from the APIs: Scrape, build databases, or otherwise create permanent copies of such content, or keep cached copies longer than permitted by the cache header; Copy, translate, modify, create a derivative work of, sell, lease, lend, convey, distribute, publicly display, or sublicense to any third party; Misrepresent the source or ownership; or Remove, obscure, or alter any copyright, trademark, or other proprietary rights notices; or falsify or delete any author attributions, legal notices, or other labels of the origin or source of material." [8]

### Coverage and data quality: how many books, how well does an isbn: query hit for ISBN-10/13, non-English and recent books; known gaps, duplicate volumes or wrong matches.

- **F8.** Google Books reported more than 40 million scanned titles in 2019; no newer figure, and no count of ISBN-bearing records, was found. [9] Confidence: low, one secondary source.
  > "As of October 2019 [ update ] , Google celebrated 15 years of Google Books and provided the number of scanned books as more than 40 million titles." [9]
- **F9.** The `isbn:` keyword is case-sensitive in practice: an uppercase `ISBN:` gives a broad text search and can return the wrong book and cover, lowercase gives the exact match. [10][2] Confidence: medium, secondary sources that agree.
  > "This can lead to an incorrect result in Google Books and a wrong book cover is displayed." [10]
  > "When searching instead for “isbn=…” the result is correct." [10]
- **F10.** Developers report valid ISBNs that return zero items while the book exists on Google Books under a volume id, and ISBN searches whose top hit is another edition; one volume often groups several editions, so the result's `industryIdentifiers` must be checked. [5][2] Confidence: low, forum reports only.
- **F11.** Results depend on the caller's location: Google restricts results by the server's or client's IP address, so the same ISBN can return differently from different countries. [1] Confidence: medium, one source.
  > "Therefore, the API results are restricted based on" [1]

### Access, rate limits and reliability: API key needed or optional? documented quotas (per day, per user), what happens without a key (shared quota / 429s), CORS from a browser, exposing a key in a client-side app (key restrictions).

- **F12.** The docs require every request, public data included, to carry an API key or an OAuth token; the key is what ties requests to a project's quota. [1] Confidence: medium, one source.
  > "If the request doesn't require authorization (such as a request for public data), then the application must provide either the API key or an OAuth 2.0 token, or both—whatever option is most convenient for you." [1]
  > "The key identifies your project and provides API access, quota, and" [1]
- **F13.** Keyless calls run on a project shared with everyone else, and on 2026-11-04 five keyless ISBN lookups all failed with HTTP 429 "Queries per day"; the same project number appears in a Google codelab issue and an app's bug report. [11][12][13][14] Confidence: high.
  > "Quota exceeded for quota metric 'Queries' and limit 'Queries per day' of service 'books.googleapis.com' for consumer 'project_number:624717413613'." [11] (unverified: not reached)
  > "The quota_limit_value is "0", which suggests the API key associated with the project (project_number:624717413613) has its daily quota set to zero or has been exhausted." [12]
  > "The application has exceeded the daily quota limit for queries to the Google Books API." [13]
- **F14.** Quotas for one's own key are not in the Books docs; forum reports give 1,000 calls a day shown in the console, a 20,000,000 per-day-per-project limit in the error's metadata, and unexplained 429s with near-zero usage, with Google staff pointing to sales for increases. [15][14] Confidence: low, forum reports that disagree.
  > "I am definitely not hitting limits and it’s showing 0/1000 calls made in GCP for the Google Books API." [15]
  > "Now suddenly I’m regularly getting an error 429 Quota exceeded for Queries per Day." [15]
- **F15.** The API answers browser requests cross-origin (the test call echoed `Access-Control-Allow-Origin` for the sent origin, even on a 429), so a client-side app can call it directly; a key shipped in the client is then public, and Google's guidance is to restrict it to the app's websites (HTTP referrers) and to the one API. [11][16][17] Confidence: medium (own observation, primary docs).
  > "Unrestricted API keys are insecure." [16]
  > "To restrict your API key to specific websites, use one of the following options:" [16]
  > "browserKeyRestrictions : The HTTP referrers (websites) that are allowed to" [17]

### Terms and cost: Google APIs Terms of Service and the Books API's own terms, attribution/branding requirements, caching/storing limits, commercial use, any cost.

- **F16.** Use is bound by the Books API Terms (last modified 2012-04-25) plus the Google APIs Terms (last modified 2021-11-09); no price for the API is stated, but the Books terms forbid charging users for the app without Google's agreement or written permission. [18][8] Confidence: medium, one primary source per point.
  > "You may not charge users any fee for the use of your application, unless you have entered into a separate agreement with Google or obtained Google's written permission." [18]
  > "Last modified: November 9, 2021 (see previous version) Thank you for using Google's APIs, other developer services, and associated software (collectively, "APIs")." [8]
- **F17.** Showing book information requires Google attribution and a prominent link per result: a "powered by Google" logo next to the results, and a link to the book's Google Books page (or a Google Preview page). [19] Confidence: medium, one source.
  > "Whenever you display such information, you must include attribution to Google and link prominently to Google Books features." [19]
  > "Every book result displayed in your application must have a prominent link to either (1) a page on your site featuring Google Preview capabilities, or (2) the Google Books page for that book." [19]
- **F18.** The branding rules also forbid altering or reordering results, using "Google" in the product's name, and placing the Google logo on a page with logos of competing search services, which bears on mixing Google data with another book API on one screen. [19] Confidence: medium, one source.
  > "You must not alter results or content made available through the Google Books API Family." [19]
  > "The Google logo may never appear next to or on the same page with the logos of competing web or other search services." [19]
- **F19.** Storing lookup results is limited by the same cache-header rule as covers (F7), Google may require content removal on request, and on termination all cached or stored content must be deleted. [8][18] Confidence: medium, primary sources.
  > "Upon any termination of the Terms or discontinuation of your access to an API, you will immediately stop using the API, cease all use of the Google Brand Features, and delete any cached or stored content that was permitted by the cache header under Section 5." [8]
  > "You must remove from your site or application any content provided through the Books API that is alleged to infringe the rights of third parties to the extent required by applicable law or upon request from Google." [18]

## The options

- **Google Books as the ISBN lookup:** for it, one call returns title, authors, identifiers and cover links (F1, F2, F3), a large catalogue (F8), CORS that allows calls from the browser (F15) and no stated price (F16); against it, keyless use failed outright (F13), quotas for one's own key are undocumented and erratic (F14), ISBN misses and wrong editions (F9, F10), covers and data that may not be kept beyond the cache header (F7, F19), and attribution, linking and no-fee duties (F16, F17, F18); what it would mean for the project, an API key restricted by referrer in the client or a small proxy, a "powered by Google" mark and a Google Books link on each book, an ISBN check on the returned volume, and a design for offline shelves that does not rest on stored Google covers.
- **Open Library as the ISBN lookup:** researched by the sibling report; this report gives only the Google side it will be compared against.
- **Google Books as a fallback behind another API:** for it, a second source for ISBNs the first misses (F8, F10); against it, the same key, quota and storage terms (F13, F19), and the branding rule against Google's logo beside competing services and against mixing results (F18); what it would mean for the project, two integrations and two sets of terms to meet.

## Risks, watch-outs and trade-offs

- **Risk:** without a key every lookup can fail with HTTP 429 at any hour, as it did on the day of research (F13).
- **Risk:** a project's own quota can drop to 429s with usage near zero, and increases go through sales, so lookups can stop with no fix on Shelf's side (F14).
- **Risk:** a key in the client is public; unrestricted, others can spend its quota (F15).
- **Watch out:** the terms allow cached copies only as long as the cache header permits, one day for covers, and require deletion on termination; this collides with offline shelves that keep covers and metadata (F7, F19).
- **Watch out:** the Books terms forbid charging users without Google's permission, and the branding rules require attribution and a Google Books link on every result (F16, F17).
- **Watch out:** query with lowercase `isbn:` and check `industryIdentifiers`, since uppercase or edition grouping can return the wrong book and cover (F9, F10).
- **Trade-off:** the browser can call the API directly, which saves a server, but a server-side proxy keeps the key private and could fetch cover bytes that the browser cannot read cross-origin (F7, F15).

## Gaps

- No successful keyless or keyed response was seen today, so the shape of a real ISBN result (whether `imageLinks` is present, http or https) rests on the docs and older reports; a test with a restricted key would settle it, and creating a key was out of scope.
- The quota for a new project's key is undocumented in the Books docs; the Cloud console's quota page, behind a sign-in, would show it.
- No measured ISBN hit rate was found for Google Books, overall or for non-English and recent books; the 2025 UK/Lithuania metadata paper [20] (not reached) or a sample run of Shelf-like ISBNs against both APIs would settle it.
- Whether storing covers or metadata in the user's own browser counts as a "cached copy" under the terms is a legal reading the sources do not settle.
- Whether the Books API has a newer terms page or deprecation plan than the 2012 terms was not found.

## Sources

1. [Using the API, Books API v1](https://developers.google.com/books/docs/v1/using?hl=en), Google for Developers. Primary. No date. Checked 2026-11-04; read in full.
2. [Google Books API searching by ISBN](https://stackoverflow.com/questions/7908954/google-books-api-searching-by-isbn), Stack Overflow. Secondary. No date. Checked 2026-11-04 through search results only; the page refused a plain fetch.
3. [Volumes reference, Books API v1](https://developers.google.com/books/docs/v1/reference/volumes?hl=en), Google for Developers. Primary. No date. Checked 2026-11-04; read in full.
4. [Performance Tips, Books API v1](https://developers.google.com/books/docs/v1/performance?hl=en), Google for Developers. Primary. No date. Checked 2026-11-04.
5. [Google Books API doesn't return results for certain ISBNs](https://stackoverflow.com/questions/75068485/google-books-api-deoesn-t-return-results-for-certain-isbns), Stack Overflow, with [How to get the extra large cover image](https://stackoverflow.com/questions/10721886/how-to-get-the-extra-large-cover-image-from-google-book-api). Secondary. No date. Checked 2026-11-04 through search results only; the pages refused a plain fetch.
6. [Obsidian book search tweaks](https://equk.co.uk/2023/08/22/obsidian-book-search-tweaks/), equk.co.uk. Secondary. 2023-08-22. Checked 2026-11-04.
7. [Cover image endpoint, books/content?id=_LettPDhwR0C](https://books.google.com/books/content?id=_LettPDhwR0C&printsec=frontcover&img=1&zoom=1&source=gbs_api), Google Books, the live response headers. Primary. No date. Checked 2026-11-04.
8. [Google APIs Terms of Service](https://developers.google.com/terms?hl=en), Google for Developers. Primary. Updated 2021-11-09. Checked 2026-11-04; read in full.
9. [Google Books](https://en.wikipedia.org/wiki/Google_Books), Wikipedia. Secondary. No date. Checked 2026-11-04.
10. [Correct Google Books cover not found due to wrong Aleph search](https://knowledge.exlibrisgroup.com/Aleph/Knowledge_Articles/Correct_Google_Books_cover_not_found_due_to_wrong_Aleph_search), Ex Libris Knowledge Center. Secondary. No date. Checked 2026-11-04.
11. [Keyless ISBN lookup, volumes?q=isbn:9780451524935](https://www.googleapis.com/books/v1/volumes?q=isbn:9780451524935), Google Books API, the live response and its headers. Primary. No date. Checked 2026-11-04.
12. [Codelab issue 240: Google Books test URL returns 429](https://github.com/google-developer-training/basic-android-kotlin-compose-training-mars-photos/issues/240), GitHub, google-developer-training. Secondary. No date. Checked 2026-11-04.
13. [books_finder issue 26: daily quota exceeded](https://github.com/bdlukaa/books_finder/issues/26), GitHub. Secondary. No date. Checked 2026-11-04.
14. [Google Books API error](https://groups.google.com/g/mementodatabase/c/YRiKv-HtVco), Google Groups, mementodatabase. Secondary. 2026-01-30 to 2026-02-07. Checked 2026-11-04; read in full.
15. [Where to start Google Books API](https://discuss.google.dev/t/where-to-start-google-books-api/162388), Google Developer forums. Secondary. 2024-08 to 2024-11. Checked 2026-11-04; read in full.
16. [Manage API keys](https://cloud.google.com/docs/authentication/api-keys?hl=en), Google Cloud. Primary. No date. Checked 2026-11-04.
17. [Add restrictions to API keys](https://cloud.google.com/api-keys/docs/add-restrictions-api-keys?hl=en), Google Cloud. Primary. No date. Checked 2026-11-04.
18. [Terms of Service, Google Books APIs](https://developers.google.com/books/terms?hl=en), Google for Developers. Primary. Updated 2012-04-25. Checked 2026-11-04; read in full.
19. [Branding Guidelines, Google Books APIs](https://developers.google.com/books/branding?hl=en), Google for Developers. Primary. No date. Checked 2026-11-04; read in full.
20. [Exploring Google Books, Open Library, and Wikipedia as Sources for Book Metadata: The UK and Lithuanian Cases](https://tagteam.harvard.edu/hub_feeds/119/feed_items/15465118), Harvard TagTeam feed. Secondary. 2025. Checked 2026-11-04; not reached (HTTP 503).

## Notes
