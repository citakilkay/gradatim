import { beforeEach, describe, expect, it } from 'vitest';
import { db, type Book } from './store/db';
import { stamp } from './store/rows';
import { addShelf, deleteShelf, ensureStartingShelves, listShelves, moveShelf, renameShelf } from './shelves';

const names = async () => (await listShelves()).map((shelf) => shelf.name);
const shelfNamed = async (name: string) => (await listShelves()).find((shelf) => shelf.name === name)!;

beforeEach(async () => {
	await Promise.all(db.tables.map((table) => table.clear()));
	await ensureStartingShelves();
});

describe('the starting shelves', () => {
	it('are Reading, To read and Finished, with Finished marked', async () => {
		const shelves = await listShelves();
		expect(shelves.map((shelf) => [shelf.name, shelf.isFinished])).toEqual([
			['Reading', false],
			['To read', false],
			['Finished', true]
		]);
	});

	it('are made once, however often Shelf opens, at once or later', async () => {
		await Promise.all([ensureStartingShelves(), ensureStartingShelves()]);
		await ensureStartingShelves();
		expect(await db.shelves.count()).toBe(3);
	});
});

describe('a shelf', () => {
	it('is renamed, and keeps its place', async () => {
		const toRead = await shelfNamed('To read');
		expect(await renameShelf(toRead.id, '  Next up ')).toEqual({ ok: true });
		expect(await names()).toEqual(['Reading', 'Next up', 'Finished']);
	});

	it('named Finished is still the marked shelf once renamed', async () => {
		const finished = await shelfNamed('Finished');
		await renameShelf(finished.id, 'Done');
		const done = await shelfNamed('Done');
		expect(done.id).toBe(finished.id);
		expect(done.isFinished).toBe(true);
		expect((await listShelves()).filter((shelf) => shelf.isFinished)).toHaveLength(1);
	});

	it('is not renamed to a blank name, or to one another shelf has', async () => {
		const reading = await shelfNamed('Reading');
		expect(await renameShelf(reading.id, '   ')).toEqual({ ok: false, reason: 'blank' });
		expect(await renameShelf(reading.id, 'to read')).toEqual({ ok: false, reason: 'taken' });
		expect(await names()).toEqual(['Reading', 'To read', 'Finished']);
	});

	it('of the reader’s own is added last', async () => {
		expect(await addShelf('Borrowed')).toEqual({ ok: true });
		expect(await names()).toEqual(['Reading', 'To read', 'Finished', 'Borrowed']);
		expect(await addShelf('Borrowed')).toEqual({ ok: false, reason: 'taken' });
	});

	it('moves up or down one place, and no further than the ends', async () => {
		const finished = await shelfNamed('Finished');
		await moveShelf(finished.id, 'up');
		expect(await names()).toEqual(['Reading', 'Finished', 'To read']);
		const reading = await shelfNamed('Reading');
		await moveShelf(reading.id, 'up');
		expect(await names()).toEqual(['Reading', 'Finished', 'To read']);
		await moveShelf(reading.id, 'down');
		expect(await names()).toEqual(['Finished', 'Reading', 'To read']);
	});

	it('is deleted softly, and leaves the list', async () => {
		await addShelf('Borrowed');
		const borrowed = await shelfNamed('Borrowed');
		expect(await deleteShelf(borrowed.id)).toEqual({ ok: true });
		expect(await names()).toEqual(['Reading', 'To read', 'Finished']);
		expect((await db.shelves.get(borrowed.id))?.deleted).toBe(true);
	});

	it('marked Finished is never deleted', async () => {
		const finished = await shelfNamed('Finished');
		expect(await deleteShelf(finished.id)).toEqual({ ok: false, reason: 'finished' });
		expect(await names()).toContain('Finished');
	});

	it('that holds a book is not deleted', async () => {
		const reading = await shelfNamed('Reading');
		await db.books.add(
			stamp<Book>({
				isbn: '9780140449136',
				shelfId: reading.id,
				title: null,
				authors: [],
				coverId: null,
				lookup: 'pending',
				addedAt: Date.now(),
				finishedAt: null
			})
		);
		expect(await deleteShelf(reading.id)).toEqual({ ok: false, reason: 'has-books' });
		expect(await names()).toContain('Reading');
	});
});
