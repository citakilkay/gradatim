import { liveQuery, type Observable } from 'dexie';
import { db, type Shelf } from './store/db';
import { change, present, softDelete, stamp } from './store/rows';

/** A new reader's shelves, in their order; the last is the marked Finished shelf (D5). */
export const STARTING_SHELVES = ['Reading', 'To read', 'Finished'] as const;

/** Why a change to a shelf was refused, for the view to say. */
export type ShelfRefusal = 'blank' | 'taken' | 'finished' | 'has-books';

export type ShelfResult = { ok: true } | { ok: false; reason: ShelfRefusal };

/** Makes the three starting shelves on Shelf's first open, once, however many pages open at once. */
export async function ensureStartingShelves(): Promise<void> {
	await db.transaction('rw', db.shelves, async () => {
		if ((await db.shelves.count()) > 0) return;
		await db.shelves.bulkAdd(
			STARTING_SHELVES.map((name, position) => stamp<Shelf>({ name, position, isFinished: name === 'Finished' }))
		);
	});
}

/** The shelves, in their order, without the deleted ones. */
export async function listShelves(): Promise<Shelf[]> {
	return present(db.shelves).sortBy('position');
}

/** The shelves as a live query, for a view: it gives the list again whenever a shelf changes. */
export function watchShelves(): Observable<Shelf[]> {
	return liveQuery(() => listShelves());
}

async function nameProblem(name: string, except?: string): Promise<ShelfRefusal | null> {
	if (name === '') return 'blank';
	const shelves = await listShelves();
	const same = shelves.find((shelf) => shelf.id !== except && shelf.name.toLowerCase() === name.toLowerCase());
	return same ? 'taken' : null;
}

/** Adds a shelf of the reader's own, last in the list. */
export async function addShelf(name: string): Promise<ShelfResult> {
	const trimmed = name.trim();
	return db.transaction('rw', db.shelves, async () => {
		const problem = await nameProblem(trimmed);
		if (problem) return { ok: false, reason: problem };
		const shelves = await listShelves();
		const position = Math.max(-1, ...shelves.map((shelf) => shelf.position)) + 1;
		await db.shelves.add(stamp<Shelf>({ name: trimmed, position, isFinished: false }));
		return { ok: true };
	});
}

/** Renames a shelf. The Finished shelf keeps its mark under any name. */
export async function renameShelf(id: string, name: string): Promise<ShelfResult> {
	const trimmed = name.trim();
	return db.transaction('rw', db.shelves, async () => {
		const problem = await nameProblem(trimmed, id);
		if (problem) return { ok: false, reason: problem };
		await change(db.shelves, id, { name: trimmed });
		return { ok: true };
	});
}

/** Moves a shelf one place up or down the list, swapping it with its neighbour. */
export async function moveShelf(id: string, direction: 'up' | 'down'): Promise<void> {
	await db.transaction('rw', db.shelves, async () => {
		const shelves = await listShelves();
		const at = shelves.findIndex((shelf) => shelf.id === id);
		const other = shelves[direction === 'up' ? at - 1 : at + 1];
		if (at < 0 || !other) return;
		const shelf = shelves[at];
		await change(db.shelves, shelf.id, { position: other.position });
		await change(db.shelves, other.id, { position: shelf.position });
	});
}

/** Deletes a shelf softly. The Finished shelf, and a shelf that holds books, can't be deleted. */
export async function deleteShelf(id: string): Promise<ShelfResult> {
	return db.transaction('rw', db.shelves, db.books, async () => {
		const shelf = await db.shelves.get(id);
		if (!shelf || shelf.deleted) return { ok: true };
		if (shelf.isFinished) return { ok: false, reason: 'finished' };
		const books = await present(db.books)
			.filter((book) => book.shelfId === id)
			.count();
		if (books > 0) return { ok: false, reason: 'has-books' };
		await softDelete(db.shelves, id);
		return { ok: true };
	});
}
