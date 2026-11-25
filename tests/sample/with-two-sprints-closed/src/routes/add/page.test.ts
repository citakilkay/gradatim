import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { goto } from '$app/navigation';
import { ensureStartingShelves } from '#lib/shelves.ts';
import { db } from '#lib/store/db.ts';
import Page from './+page.svelte';

vi.mock('$app/navigation', () => ({ goto: vi.fn() }));

beforeEach(async () => {
	await Promise.all(db.tables.map((table) => table.clear()));
	await ensureStartingShelves();
});

afterEach(() => {
	vi.mocked(goto).mockClear();
});

async function fill(isbn: string, shelf: string) {
	render(Page);
	await screen.findByRole('option', { name: shelf });
	await fireEvent.input(screen.getByLabelText('ISBN'), { target: { value: isbn } });
	const select = screen.getByLabelText('Shelf') as HTMLSelectElement;
	const option = screen.getByRole('option', { name: shelf }) as HTMLOptionElement;
	await fireEvent.change(select, { target: { value: option.value } });
	await fireEvent.click(screen.getByRole('button', { name: 'Add' }));
}

describe('the add page', () => {
	it('lists the shelves to pick from', async () => {
		render(Page);
		await screen.findByRole('option', { name: 'Reading' });
		expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual(['Reading', 'To read', 'Finished']);
	});

	it('saves the book on the shelf picked, and goes back to the shelves', async () => {
		await fill('978-0-14-044913-6', 'To read');
		await waitFor(() => expect(goto).toHaveBeenCalledWith('/'));
		const [book] = await db.books.toArray();
		const shelf = await db.shelves.get(book.shelfId);
		expect(book.isbn).toBe('9780140449136');
		expect(shelf?.name).toBe('To read');
	});

	it('refuses a wrong ISBN, says why, and stays', async () => {
		await fill('978-0-14-044913-7', 'Reading');
		expect(await screen.findByRole('alert')).toHaveTextContent('That isn’t an ISBN');
		expect(goto).not.toHaveBeenCalled();
		expect(await db.books.count()).toBe(0);
	});

	it('says which shelf already holds a book', async () => {
		await fill('9780140449136', 'Reading');
		await waitFor(() => expect(goto).toHaveBeenCalledOnce());
		document.body.innerHTML = '';
		await fill('0-14-044913-2', 'Finished');
		expect(await screen.findByRole('alert')).toHaveTextContent('That book is already on Reading.');
		expect(await db.books.count()).toBe(1);
	});
});
