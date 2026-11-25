import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		sveltekit({
			preprocess: vitePreprocess(),
			// Plain files in build/, served by Cloudflare Pages.
			adapter: adapter({
				pages: 'build',
				assets: 'build',
				strict: true
			})
		}),
		// Resolves Svelte's browser build and cleans up after each component test.
		svelteTesting()
	],
	test: {
		environment: 'jsdom',
		// Playwright's tests live in e2e/, out of Vitest's reach.
		include: ['src/**/*.{test,spec}.ts'],
		setupFiles: ['src/vitest-setup.ts']
	}
});
