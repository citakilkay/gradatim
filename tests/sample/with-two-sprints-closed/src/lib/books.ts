import { normalizeIsbn } from './isbn';
import { db, type Book, type Lookup } from './store/db';
import { now, present, softDelete, stamp } from './store/rows';

export type AddBookResult =
	| { ok: true; book: Book }
	| { ok: false; reason: 'invalid-isbn' }
	| { ok: false; reason: 'already-shelved'; shelfName: string };

/**
 * Adds a book by its ISBN to a shelf, at once (D4): the book, `pending`, and its entry in the lookup
 * queue are written in one transaction, so that both are saved or neither is. The ISBN is kept as its
 * ISBN-13, and a book already on a shelf isn't added again.
 */
export async function addBook(isbnInput: string, shelfId: string): Promise<AddBookResult> {
	const isbn = normalizeIsbn(isbnInput);
	if (!isbn) return { ok: false, reason: 'invalid-isbn' };
	return db.transaction('rw', db.books, db.lookups, db.shelves, async () => {
		const shelved = await present(db.books)
			.filter((book) => book.isbn === isbn)
			.first();
		if (shelved) {
			const shelf = await db.shelves.get(shelved.shelfId);
			return { ok: false, reason: 'already-shelved', shelfName: shelf?.name ?? '' };
		}
		const addedAt = now();
		const book = stamp<Book>({
			isbn,
			shelfId,
			title: null,
			authors: [],
			coverId: null,
			lookup: 'pending',
			addedAt,
			finishedAt: null
		});
		await db.books.add(book);
		await db.lookups.add(stamp<Lookup>({ bookId: book.id, tries: 0, nextTryAt: addedAt }));
		return { ok: true, book };
	});
}

/** A shelf's books, in the order they were added, without the removed ones. */
export async function listBooks(shelfId: string): Promise<Book[]> {
	return present(db.books)
		.filter((book) => book.shelfId === shelfId)
		.sortBy('addedAt');
}

/** Removes a book softly, with its entry in the lookup queue, so that nothing looks it up again. */
export async function removeBook(id: string): Promise<void> {
	await db.transaction('rw', db.books, db.lookups, async () => {
		await softDelete(db.books, id);
		const entries = await present(db.lookups)
			.filter((entry) => entry.bookId === id)
			.toArray();
		for (const entry of entries) await softDelete(db.lookups, entry.id);
	});
}
