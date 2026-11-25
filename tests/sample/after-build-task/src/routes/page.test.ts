import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Page from './+page.svelte';

describe('the home page', () => {
	it("shows the app's name as its heading", () => {
		render(Page);
		expect(screen.getByRole('heading', { level: 1, name: 'Shelf' })).toBeInTheDocument();
	});
});
