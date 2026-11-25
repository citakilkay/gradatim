import { expect, test } from '@playwright/test';
import pkg from '../package.json' with { type: 'json' };

test('the footer shows the version and the report link', async ({ page }) => {
	await page.goto('/');
	const footer = page.getByRole('contentinfo');
	await expect(footer).toContainText(`Shelf version ${pkg.version}`);
	await expect(footer.getByRole('link', { name: 'Report a problem' })).toHaveAttribute(
		'href',
		'https://github.com/example/shelf/issues'
	);
});
