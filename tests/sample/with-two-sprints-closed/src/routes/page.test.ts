import { fireEvent, render, screen, waitFor, within } from '@testing-library/svelte';
import { beforeEach, describe, expect, it } from 'vitest';
import { addBook } from '#lib/books.ts';
import { ensureStartingShelves, listShelves } from '#lib/shelves.ts';
import { db } from '#lib/store/db.ts';
import Page from './+page.svelte';

beforeEach(async () => {
	await Promise.all(db.tables.map((table) => table.clear()));
	await ensureStartingShelves();
});

const shelfHeadings = async () => (await screen.findAllByRole('heading', { level: 2 })).map((heading) => heading.textContent);

describe('the home page', () => {
	it("shows the app's name as its heading", () => {
		render(Page);
		expect(screen.getByRole('heading', { level: 1, name: 'Shelf' })).toBeInTheDocument();
	});

	it('shows the shelves in their order, with Finished marked', async () => {
		render(Page);
		expect(await shelfHeadings()).toEqual(['Reading', 'To read', 'Finished']);
		const finished = screen.getByRole('region', { name: 'Finished' });
		expect(within(finished).getByText('the finished shelf')).toBeInTheDocument();
	});

	it('renames a shelf', async () => {
		render(Page);
		await fireEvent.click(await screen.findByRole('button', { name: 'Rename To read' }));
		await fireEvent.input(screen.getByLabelText('New name for To read'), { target: { value: 'Next up' } });
		await fireEvent.click(screen.getByRole('button', { name: 'Save' }));
		expect(await screen.findByRole('heading', { level: 2, name: 'Next up' })).toBeInTheDocument();
		expect((await listShelves()).map((shelf) => shelf.name)).toEqual(['Reading', 'Next up', 'Finished']);
	});

	it('adds a shelf of the reader’s own, last', async () => {
		render(Page);
		await screen.findByRole('heading', { level: 2, name: 'Reading' });
		await fireEvent.input(screen.getByLabelText('New shelf'), { target: { value: 'Borrowed' } });
		await fireEvent.click(screen.getByRole('button', { name: 'Add shelf' }));
		expect(await screen.findByRole('heading', { level: 2, name: 'Borrowed' })).toBeInTheDocument();
		expect(await shelfHeadings()).toEqual(['Reading', 'To read', 'Finished', 'Borrowed']);
	});

	it('says why the Finished shelf, and a shelf that holds books, can’t be deleted', async () => {
		const [reading] = await listShelves();
		await addBook('9780140449136', reading.id);
		render(Page);
		await fireEvent.click(await screen.findByRole('button', { name: 'Delete Finished' }));
		expect(await screen.findByRole('alert')).toHaveTextContent('The Finished shelf stays');
		await fireEvent.click(screen.getByRole('button', { name: 'Delete Reading' }));
		await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('This shelf holds books'));
		expect(await shelfHeadings()).toEqual(['Reading', 'To read', 'Finished']);
	});

	it('shows each book on its shelf by its ISBN', async () => {
		const [, toRead] = await listShelves();
		await addBook('978-0-14-044913-6', toRead.id);
		render(Page);
		const shelf = await screen.findByRole('region', { name: 'To read' });
		expect(await within(shelf).findByText('ISBN 9780140449136')).toBeInTheDocument();
	});
});
