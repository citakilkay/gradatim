import { Dexie, type Table } from 'dexie';
import type { Row } from './rows';

/** A shelf: the reader's name for it, its place in the list, and whether it is the marked Finished shelf (D5). */
export interface Shelf extends Row {
	name: string;
	position: number;
	isFinished: boolean;
}

/** Where a book's details stand: waiting for the lookup, found, unknown to Open Library, or typed by hand. */
export type LookupState = 'pending' | 'found' | 'not-found' | 'manual';

/** A book, on exactly one shelf (D5). Its title, authors and cover ID wait for the lookup (D4). */
export interface Book extends Row {
	isbn: string;
	shelfId: string;
	title: string | null;
	authors: string[];
	coverId: number | null;
	lookup: LookupState;
	addedAt: number;
	/** Set when the book is moved onto Finished, cleared when it is moved off, and editable (D7). */
	finishedAt: number | null;
}

/** A book's cover: the image itself, or only its URL, as Open Library's answer allows (D6). */
export interface Cover extends Row {
	bookId: string;
	blob: Blob | null;
	url: string | null;
}

/** A lookup still to do, with the number of tries so far and the time of the next one. */
export interface Lookup extends Row {
	bookId: string;
	tries: number;
	nextTryAt: number;
}

/** Shelf's one IndexedDB database, which the device store owns (D13). */
export class ShelfDatabase extends Dexie {
	shelves!: Table<Shelf, string>;
	books!: Table<Book, string>;
	covers!: Table<Cover, string>;
	lookups!: Table<Lookup, string>;

	constructor(name = 'shelf') {
		super(name);
		// The first schema. A change adds version 2 below, with its upgrade, and never edits this one.
		this.version(1).stores({
			shelves: 'id, position, updatedAt',
			books: 'id, isbn, shelfId, addedAt, updatedAt',
			covers: 'id, bookId, updatedAt',
			lookups: 'id, bookId, nextTryAt, updatedAt'
		});
	}
}

export const db = new ShelfDatabase();
