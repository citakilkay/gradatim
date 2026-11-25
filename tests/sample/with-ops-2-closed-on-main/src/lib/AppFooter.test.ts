import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
// The file as raw text, read apart from the footer's own import.
import packageJson from '../../package.json?raw';
import AppFooter from './AppFooter.svelte';

describe('the footer', () => {
	it("shows the app's name and version", () => {
		const { version } = JSON.parse(packageJson) as { version: string };
		render(AppFooter);
		expect(screen.getByRole('contentinfo')).toHaveTextContent(`Shelf ${version}`);
	});

	it('links to the page where a reader reports a problem', () => {
		render(AppFooter);
		expect(screen.getByRole('link', { name: 'Report a problem' })).toHaveAttribute(
			'href',
			'https://github.com/example/shelf/issues'
		);
	});
});
