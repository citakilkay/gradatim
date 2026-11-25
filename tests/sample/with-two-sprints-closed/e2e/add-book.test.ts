import { expect, test } from '@playwright/test';

test('a book added by its ISBN shows on its shelf by its ISBN', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: 'Add a book' }).click();
	await expect(page.getByRole('heading', { level: 1, name: 'Add a book' })).toBeVisible();

	await page.getByLabel('ISBN').fill('978-0-14-044913-6');
	await page.getByLabel('Shelf').selectOption({ label: 'To read' });
	await page.getByRole('button', { name: 'Add' }).click();

	await expect(page).toHaveURL('/');
	const toRead = page.getByRole('region', { name: 'To read' });
	await expect(toRead.getByText('ISBN 9780140449136')).toBeVisible();
});
