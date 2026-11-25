import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import pkg from '../../package.json';
import AppFooter from './AppFooter.svelte';

describe('the app footer', () => {
	it('shows "Shelf version" and the version from package.json', () => {
		render(AppFooter);
		const footer = screen.getByRole('contentinfo');
		expect(footer).toHaveTextContent(`Shelf version ${pkg.version}`);
	});

	it('links to the page where a reader reports a problem', () => {
		render(AppFooter);
		const link = screen.getByRole('link', { name: 'Report a problem' });
		expect(link).toHaveAttribute('href', 'https://github.com/example/shelf/issues');
	});
});
