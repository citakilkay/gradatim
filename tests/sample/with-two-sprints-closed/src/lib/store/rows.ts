import type { Collection, Table } from 'dexie';

/** The fields every stored row carries, so that sync can be added without changing the data (D11). */
export interface Row {
	/** A random UUID, the same on every device. */
	id: string;
	/** When the row last changed, by the device clock in milliseconds: sync compares it (D9). */
	updatedAt: number;
	/** A removal kept as a flag, so that it can sync like any other change. */
	deleted: boolean;
}

/** A row's own fields: what a module writes, without the three that this helper stamps. */
export type Fields<T extends Row> = Omit<T, keyof Row>;

/** The clock that stamps every write: the device's, for now; P1.3 may change what it means. */
export function now(): number {
	return Date.now();
}

/** A new row: its fields, with a fresh id, this moment, and not deleted. */
export function stamp<T extends Row>(fields: Fields<T>): T {
	return { ...fields, id: crypto.randomUUID(), updatedAt: now(), deleted: false } as T;
}

/** Changes some of a row's fields, and stamps the change. */
export async function change<T extends Row>(table: Table<T, string>, id: string, fields: Partial<Fields<T>>): Promise<void> {
	await table.update(id, (row) => {
		Object.assign(row, fields);
		row.updatedAt = now();
	});
}

/** Removes a row softly: it stays in its table, marked deleted, and the reads leave it out. */
export async function softDelete<T extends Row>(table: Table<T, string>, id: string): Promise<void> {
	await table.update(id, (row) => {
		row.deleted = true;
		row.updatedAt = now();
	});
}

/** The rows of a table that aren't deleted, for a module's reads. */
export function present<T extends Row>(table: Table<T, string>): Collection<T, string> {
	return table.filter((row) => !row.deleted);
}
