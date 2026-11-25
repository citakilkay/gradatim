# 01 · Book lookup and shelves

*Decide's first session, 2026-11-05, from the research in [docs/research/](../research/README.md): which book API and endpoint Shelf uses, how shelves catch up, how a book is added, how shelves and the yearly count work, covers offline, free use, and sync conflicts.*

### D1 · Open Library for ISBN lookup

- **Decision:** Shelf looks up books in Open Library only, with no second API behind it.
- **Over:** Google Books, which needs a key, has an undocumented quota, failed every keyless call on the day of research, requires its branding on each result, and allows cached covers for one day only. Also over Open Library with a Google Books fallback, which means two sets of terms and conflicts with Google's rule against appearing next to competing services.
- **Why:** no key, open CORS, CC0 data and no cost (01 F13, 01 F15, 01 F19). Nothing in its terms conflicts with offline shelves, unlike Google's (02 F7, 02 F19). Google's fallback rule is in 02 F18. The risk of Internet Archive outages (01 F16) is carried by D4.
- **Date:** 2026-11-05.

### D2 · Open Library's ISBN API, with the Authors API for names

- **Decision:** Shelf uses the current ISBN API (`/isbn/{isbn}.json`) for the edition, and a second call to the Authors API for each author's name. It does not use the legacy Books API or search.json.
- **Over:** the Books API, which gets all three fields in one call but is marked legacy and may be phased out (01 F2). Also over search.json, which returns the work's title and cover rather than the edition's (01 F4).
- **Why:** it is the current endpoint, and it gives edition-exact cover IDs and on-demand import of missing ISBNs (01 F1, 01 F3, 01 F12). Covers fetched by cover ID skip the cap of 100 covers by ISBN per 5 minutes (01 F6). The cost is two or more requests per book against the 1 to 3 requests a second limit (01 F3, 01 F14), which fits one reader adding books one at a time. The user chose this from the research as it stands, with no further research.
- **Date:** 2026-11-05.

### D3 · An account, with shelves synced across devices

- **Decision:** a reader signs in to an account. Shelves live on the device, work offline, and sync with the server whenever the device is online, so they follow the reader across devices.
- **Over:** device-only shelves, which a cleared browser would lose. Also over device-only shelves with file export and import, which leaves backups to the reader.
- **Why:** this is the plain reading of the idea's "catch up when the reader is back online". The shelves survive a cleared browser and reach every device.
- **Date:** 2026-11-05.

### D4 · Adding a book never blocks

- **Decision:** a book is saved as soon as the reader enters its ISBN, and its title, author and cover are filled in once a lookup succeeds, retried when the device is back online or Open Library is back up. If Open Library has no record for the ISBN, the reader types the title and author.
- **Over:** saving and filling in later with no manual entry, which would leave some books as bare ISBNs for good. Also over waiting for the lookup before saving, which would fail offline and during outages.
- **Why:** Open Library can be down for days (01 F16), and about a third of editions in one sample had no ISBN (01 F10). The reader is offline at times, as D3 expects.
- **Date:** 2026-11-05.

### D5 · Named shelves, one per book, with a marked Finished shelf

- **Decision:** a new reader starts with three shelves, Reading, To read and Finished, which they can rename, and can add shelves of their own. Each book sits on exactly one shelf. The Finished shelf is marked as such, so moving a book onto it records the date it was finished.
- **Over:** letting a book sit on several shelves, with "finished" as a separate status. Also over a fixed set of three shelves, which would drop "shelves they name".
- **Why:** this keeps the idea's own examples and the reader's own names, and the finished date it records is what the count of books finished this year needs.
- **Date:** 2026-11-05.

### D6 · Covers stored on the device, pending Open Library's word

- **Decision:** Shelf stores each book's cover image on the device, so covers show offline. Before release, Shelf asks openlibrary@archive.org whether an app may do this. If they say no, Shelf stores only the cover URL and shows a placeholder offline.
- **Over:** storing only the cover URL from the start, which loses covers offline with no need to. Also over no covers at all, which drops part of the idea.
- **Why:** offline shelves (D3) are part of the idea, and Open Library's data is CC0 (01 F19). No page says whether covers may be stored on the device, and the covers' rights aren't granted (01 F8, 01 F20), so the research named asking Open Library as the way to settle it.
- **Date:** 2026-11-05.

### D7 · Finished this year counts by an editable finished date

- **Decision:** the count of books finished this year counts the books whose finished date falls in the current calendar year. The reader can edit a book's finished date, and moving a book off the Finished shelf clears its date.
- **Over:** a date the reader can't edit, which can't record books finished before the reader started using Shelf. Also over counting what sits on Finished now with no stored dates, which keeps no history.
- **Why:** it builds on the finished date that D5 records, and it lets the count be correct for books the reader finished before using Shelf.
- **Date:** 2026-11-05.

### D8 · Free and non-commercial

- **Decision:** Shelf is free and non-commercial.
- **Over:** leaving a paid tier open for later, which would mean checking Open Library's terms again.
- **Why:** Open Library's guidelines rule out high-traffic commercial backends, and the Internet Archive terms are summarised as for scholarship and research (01 F21, 01 F22). D1 depends on staying within them.
- **Date:** 2026-11-05.

### D9 · The latest change wins when devices sync

- **Decision:** when two devices change the same book, the later change wins when they sync.
- **Over:** showing the conflict and asking the reader, which adds a screen that one reader on a few devices rarely needs.
- **Why:** D3 syncs from several devices that each work offline. For one reader, the latest change is nearly always the one they meant.
- **Date:** 2026-11-05.
