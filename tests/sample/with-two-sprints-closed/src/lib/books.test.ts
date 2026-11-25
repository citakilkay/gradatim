import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { addBook, listBooks, removeBook } from './books';
import { ensureStartingShelves, listShelves } from './shelves';
import { db, type Shelf } from './store/db';

let reading: Shelf;
let toRead: Shelf;

beforeEach(async () => {
	await Promise.all(db.tables.map((table) => table.clear()));
	await ensureStartingShelves();
	[reading, toRead] = await listShelves();
});

afterEach(() => {
	vi.useRealTimers();
	vi.restoreAllMocks();
});

describe('addBook', () => {
	it('saves the book, pending, on its shelf, and its entry in the lookup queue', async () => {
		const result = await addBook('978-0-14-044913-6', toRead.id);
		expect(result.ok).toBe(true);
		const [book] = await db.books.toArray();
		expect(book).toMatchObject({ isbn: '9780140449136', shelfId: toRead.id, title: null, lookup: 'pending', deleted: false });
		const [entry] = await db.lookups.toArray();
		expect(entry).toMatchObject({ bookId: book.id, tries: 0, deleted: false });
	});

	it('keeps an ISBN-10 as its ISBN-13', async () => {
		await addBook('0141439513', reading.id);
		expect((await db.books.toArray()).map((book) => book.isbn)).toEqual(['9780141439518']);
	});

	it('saves neither the book nor its entry when the entry can’t be written', async () => {
		vi.spyOn(db.lookups, 'add').mockRejectedValueOnce(new Error('the disk is full'));
		await expect(addBook('9780140449136', toRead.id)).rejects.toThrow('the disk is full');
		expect(await db.books.count()).toBe(0);
		expect(await db.lookups.count()).toBe(0);
	});

	it('refuses a wrong ISBN, and saves nothing', async () => {
		expect(await addBook('9780140449137', toRead.id)).toEqual({ ok: false, reason: 'invalid-isbn' });
		expect(await addBook('not an isbn', toRead.id)).toEqual({ ok: false, reason: 'invalid-isbn' });
		expect(await db.books.count()).toBe(0);
		expect(await db.lookups.count()).toBe(0);
	});

	it('doesn’t add a book a second time, and names the shelf that holds it', async () => {
		await addBook('9780140449136', toRead.id);
		expect(await addBook('0-14-044913-2', reading.id)).toEqual({ ok: false, reason: 'already-shelved', shelfName: 'To read' });
		expect(await db.books.count()).toBe(1);
	});

	it('adds a book again once it has been removed', async () => {
		const first = await addBook('9780140449136', toRead.id);
		if (!first.ok) throw new Error('the book was not added');
		await removeBook(first.book.id);
		expect((await addBook('9780140449136', reading.id)).ok).toBe(true);
		expect((await listBooks(reading.id)).map((book) => book.isbn)).toEqual(['9780140449136']);
	});
});

describe('listBooks', () => {
	it('lists a shelf’s books in the order they were added', async () => {
		// Only the clock is faked: the in-memory IndexedDB runs on real timers.
		vi.useFakeTimers({ toFake: ['Date'] });
		vi.setSystemTime(new Date('2026-11-12T09:00:00Z'));
		await addBook('9780141439518', toRead.id);
		vi.setSystemTime(new Date('2026-11-12T09:01:00Z'));
		await addBook('9780140449136', toRead.id);
		await addBook('9780306406157', reading.id);
		expect((await listBooks(toRead.id)).map((book) => book.isbn)).toEqual(['9780141439518', '9780140449136']);
	});
});

describe('removeBook', () => {
	it('removes a book softly, with its lookup entry', async () => {
		const added = await addBook('9780140449136', toRead.id);
		if (!added.ok) throw new Error('the book was not added');
		await removeBook(added.book.id);
		expect(await listBooks(toRead.id)).toEqual([]);
		expect((await db.books.get(added.book.id))?.deleted).toBe(true);
		expect((await db.lookups.toArray()).every((entry) => entry.deleted)).toBe(true);
	});
});
