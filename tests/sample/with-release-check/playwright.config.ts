import { defineConfig, devices } from '@playwright/test';

// Runs against the production build served by `vite preview`, never the dev server; or, where SHELF_BASE_URL names
// an address, against Shelf as it runs there, such as production, with no server of its own. `npm run test:e2e:at`
// sets it from its argument. Every test runs at a desktop's width and at a phone's, where Shelf is installed most.
const at = process.env.SHELF_BASE_URL;

export default defineConfig({
	testDir: 'e2e',
	use: {
		baseURL: at ?? 'http://localhost:4173',
		// Each test's last screen, kept in test-results/, which git ignores.
		screenshot: 'on'
	},
	projects: [
		{ name: 'desktop', use: { ...devices['Desktop Chrome'] } },
		{ name: 'phone', use: { ...devices['Pixel 7'] } }
	],
	webServer: at
		? undefined
		: {
				command: 'npm run build && npm run preview -- --port 4173 --strictPort',
				url: 'http://localhost:4173',
				reuseExistingServer: false,
				timeout: 120_000
			}
});
