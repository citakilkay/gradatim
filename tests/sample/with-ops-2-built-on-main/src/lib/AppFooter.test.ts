import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import AppFooter from './AppFooter.svelte';

describe('the footer', () => {
	it("shows the app's name and version", () => {
		render(AppFooter);
		expect(screen.getByRole('contentinfo')).toHaveTextContent('Shelf');
	});

	it('links to the page where a reader reports a problem', () => {
		render(AppFooter);
		expect(screen.getByRole('link', { name: 'Report a problem' })).toHaveAttribute(
			'href',
			'https://github.com/example/shelf/issues'
		);
	});
});
