import { expect, test } from '@playwright/test';

test("the home page shows the app's name as its heading", async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('Shelf')).toBeVisible();
});
