<script lang="ts">
	import type { Snippet } from 'svelte';
	import AppFooter from '#lib/AppFooter.svelte';

	let { children }: { children: Snippet } = $props();
</script>

{@render children()}

<AppFooter />
