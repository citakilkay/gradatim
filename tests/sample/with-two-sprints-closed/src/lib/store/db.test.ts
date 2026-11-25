import { beforeEach, describe, expect, it } from 'vitest';
import { db, ShelfDatabase, type Book, type Cover, type Lookup, type Shelf } from './db';
import { change, now, present, softDelete, stamp } from './rows';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

beforeEach(async () => {
	await db.open();
	await Promise.all(db.tables.map((table) => table.clear()));
});

describe('the device store', () => {
	it('writes and reads a row in each table, with its id, updatedAt and deleted set', async () => {
		const before = now();
		const shelf = stamp<Shelf>({ name: 'Reading', position: 0, isFinished: false });
		const book = stamp<Book>({
			isbn: '9780140449136',
			shelfId: shelf.id,
			title: null,
			authors: [],
			coverId: null,
			lookup: 'pending',
			addedAt: before,
			finishedAt: null
		});
		const cover = stamp<Cover>({ bookId: book.id, blob: null, url: 'https://covers.openlibrary.org/b/id/8231856-M.jpg' });
		const lookup = stamp<Lookup>({ bookId: book.id, tries: 0, nextTryAt: before });
		await db.shelves.add(shelf);
		await db.books.add(book);
		await db.covers.add(cover);
		await db.lookups.add(lookup);

		const read = [
			await db.shelves.get(shelf.id),
			await db.books.get(book.id),
			await db.covers.get(cover.id),
			await db.lookups.get(lookup.id)
		];
		for (const row of read) {
			expect(row?.id).toMatch(UUID);
			expect(row?.updatedAt).toBeGreaterThanOrEqual(before);
			expect(row?.deleted).toBe(false);
		}
		expect(read[0]).toEqual(shelf);
		expect(read[1]).toEqual(book);
		expect(read[2]).toEqual(cover);
		expect(read[3]).toEqual(lookup);
	});

	it('stamps a change with a later updatedAt', async () => {
		const shelf = stamp<Shelf>({ name: 'To read', position: 1, isFinished: false });
		await db.shelves.add({ ...shelf, updatedAt: shelf.updatedAt - 1000 });
		await change(db.shelves, shelf.id, { name: 'Next up' });
		const read = await db.shelves.get(shelf.id);
		expect(read?.name).toBe('Next up');
		expect(read?.updatedAt).toBeGreaterThan(shelf.updatedAt - 1000);
	});

	it('leaves a soft-deleted row out of the reads, and keeps it in the table', async () => {
		const kept = stamp<Shelf>({ name: 'Reading', position: 0, isFinished: false });
		const gone = stamp<Shelf>({ name: 'Borrowed', position: 1, isFinished: false });
		await db.shelves.bulkAdd([kept, { ...gone, updatedAt: gone.updatedAt - 1000 }]);

		await softDelete(db.shelves, gone.id);

		expect((await present(db.shelves).toArray()).map((shelf) => shelf.name)).toEqual(['Reading']);
		const stored = await db.shelves.get(gone.id);
		expect(stored?.deleted).toBe(true);
		expect(stored?.updatedAt).toBeGreaterThan(gone.updatedAt - 1000);
	});

	it('opens again after a reload, with its rows', async () => {
		const shelf = stamp<Shelf>({ name: 'Finished', position: 2, isFinished: true });
		await db.shelves.add(shelf);
		db.close();

		// A reload opens the same database by its name, from a fresh page.
		const reopened = new ShelfDatabase();
		await reopened.open();
		expect(await reopened.shelves.get(shelf.id)).toEqual(shelf);
		reopened.close();
		await db.open();
	});
});
