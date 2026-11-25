import { expect, test } from '@playwright/test';
import packageJson from '../package.json' with { type: 'json' };

test("the footer shows the app's name, its version and the report link", async ({ page }) => {
	await page.goto('/');
	const footer = page.getByRole('contentinfo');
	await expect(footer).toContainText(`Shelf ${packageJson.version}`);
	await expect(footer.getByRole('link', { name: 'Report a problem' })).toHaveAttribute(
		'href',
		'https://github.com/example/shelf/issues'
	);
});
