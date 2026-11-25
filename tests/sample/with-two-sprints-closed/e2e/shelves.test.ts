import { expect, test } from '@playwright/test';

test('a reader renames To read and adds a shelf, and sees both after reopening Shelf offline', async ({ page, context }) => {
	await page.goto('/');
	await page.evaluate(async () => {
		await navigator.serviceWorker.ready;
	});

	await page.getByRole('button', { name: 'Rename To read' }).click();
	await page.getByLabel('New name for To read').fill('Next up');
	await page.getByRole('button', { name: 'Save' }).click();
	await page.getByLabel('New shelf').fill('Borrowed');
	await page.getByRole('button', { name: 'Add shelf' }).click();
	await expect(page.getByRole('heading', { level: 2, name: 'Borrowed' })).toBeVisible();

	// Reopening Shelf: its page closed, and opened again in a new one, with the network off.
	await context.setOffline(true);
	await page.close();
	const reopened = await context.newPage();
	await reopened.goto('/');

	await expect(reopened.getByRole('heading', { level: 2 })).toHaveText(['Reading', 'Next up', 'Finished', 'Borrowed']);
});
