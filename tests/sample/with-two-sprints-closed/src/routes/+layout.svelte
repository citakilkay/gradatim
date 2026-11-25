<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import AppFooter from '#lib/AppFooter.svelte';
	import { ensureStartingShelves } from '#lib/shelves.ts';

	let { children }: { children: Snippet } = $props();

	// A new reader's three shelves, made on Shelf's first open, whichever page opens first.
	onMount(() => {
		void ensureStartingShelves();
	});
</script>

<main>
	{@render children()}
</main>

<AppFooter />

<style>
	:global(body) {
		margin: 0;
		background: #fbf8f3;
		color: #2b2a28;
		font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
		line-height: 1.5;
	}

	:global(button),
	:global(input),
	:global(select) {
		font: inherit;
	}

	:global(button) {
		border: 1px solid #3d5a40;
		border-radius: 6px;
		background: #fff;
		color: #3d5a40;
		padding: 0.25rem 0.6rem;
		cursor: pointer;
	}

	:global(button:disabled) {
		opacity: 0.45;
		cursor: default;
	}

	:global(button[type='submit']) {
		background: #3d5a40;
		color: #fff;
	}

	:global(footer) {
		max-width: 40rem;
		margin: 0 auto;
		padding: 1rem;
		color: #6b6862;
		font-size: 0.875rem;
	}

	main {
		max-width: 40rem;
		margin: 0 auto;
		padding: 1rem;
	}
</style>
