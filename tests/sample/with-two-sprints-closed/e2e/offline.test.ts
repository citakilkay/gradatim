import { expect, test } from '@playwright/test';

test('after a first visit, Shelf opens with the network off', async ({ page, context }) => {
	await page.goto('/');
	// The worker is ready once it has cached the app shell.
	await page.evaluate(async () => {
		await navigator.serviceWorker.ready;
	});

	await context.setOffline(true);
	await page.reload();

	await expect(page.getByRole('heading', { level: 1, name: 'Shelf' })).toBeVisible();
	await expect(page.getByRole('contentinfo')).toContainText('Shelf');
	expect(await page.evaluate(() => navigator.serviceWorker.controller !== null)).toBe(true);
});

test('the browser can install Shelf, by Chromium’s own check', async ({ page }) => {
	await page.goto('/');
	await page.evaluate(async () => {
		await navigator.serviceWorker.ready;
	});

	const cdp = await page.context().newCDPSession(page);
	const manifest = await cdp.send('Page.getAppManifest');
	expect(new URL(manifest.url).pathname).toBe('/manifest.webmanifest');
	expect(manifest.errors).toEqual([]);
	// What would stop Chromium offering to install the app: no manifest, no icon, no worker, and so on.
	const { installabilityErrors } = await cdp.send('Page.getInstallabilityErrors');
	expect(installabilityErrors).toEqual([]);
});
