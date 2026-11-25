import { defineConfig, devices } from '@playwright/test';

// Runs against the production build served by `vite preview`, never the dev server.
export default defineConfig({
	testDir: 'e2e',
	// A stray test.only must fail the gate in CI, not narrow it.
	forbidOnly: !!process.env.CI,
	use: {
		baseURL: 'http://localhost:4173'
	},
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
	webServer: {
		command: 'npm run build && npm run preview -- --port 4173 --strictPort',
		url: 'http://localhost:4173',
		reuseExistingServer: false,
		timeout: 120_000
	}
});
