import { defineConfig, devices } from '@playwright/test';

// Runs against the production build served by `vite preview`, never the dev server.
// Every test runs at a desktop's width and at a phone's, where Shelf is installed most.
export default defineConfig({
	testDir: 'e2e',
	use: {
		baseURL: 'http://localhost:4173',
		// Each test's last screen, kept in test-results/, which git ignores.
		screenshot: 'on'
	},
	projects: [
		{ name: 'desktop', use: { ...devices['Desktop Chrome'] } },
		{ name: 'phone', use: { ...devices['Pixel 7'] } }
	],
	webServer: {
		command: 'npm run build && npm run preview -- --port 4173 --strictPort',
		url: 'http://localhost:4173',
		reuseExistingServer: false,
		timeout: 120_000
	}
});
