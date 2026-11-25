<script lang="ts">
	import { goto } from '$app/navigation';
	import { addBook } from '#lib/books.ts';
	import { online } from '#lib/online.ts';
	import { watchShelves } from '#lib/shelves.ts';

	const shelves = watchShelves();

	let isbn = $state('');
	let shelfId = $state('');
	let problem = $state('');
	let saving = $state(false);

	// The first shelf is picked until the reader picks another.
	$effect(() => {
		if (!shelfId && $shelves?.length) shelfId = $shelves[0].id;
	});

	async function add(event: SubmitEvent) {
		event.preventDefault();
		saving = true;
		const result = await addBook(isbn, shelfId);
		saving = false;
		if (result.ok) await goto('/');
		else if (result.reason === 'invalid-isbn') problem = 'That isn’t an ISBN: check its 10 or 13 digits.';
		else problem = `That book is already on ${result.shelfName}.`;
	}
</script>

<h1>Add a book</h1>

<form onsubmit={add}>
	<label for="isbn">ISBN</label>
	<input id="isbn" bind:value={isbn} autocomplete="off" placeholder="10 or 13 digits" required />

	<label for="shelf">Shelf</label>
	<select id="shelf" bind:value={shelfId}>
		{#each $shelves ?? [] as shelf (shelf.id)}
			<option value={shelf.id}>{shelf.name}</option>
		{/each}
	</select>

	{#if problem}
		<p class="problem" role="alert">{problem}</p>
	{/if}

	<div class="buttons">
		<button type="submit" disabled={saving || !$online}>Add</button>
		<a href="/">Back to the shelves</a>
	</div>
</form>

<style>
	form {
		display: grid;
		gap: 0.4rem;
		max-width: 24rem;
	}

	label {
		font-weight: 600;
		margin-top: 0.5rem;
	}

	input,
	select {
		border: 1px solid #c8c1b4;
		border-radius: 6px;
		padding: 0.4rem 0.5rem;
	}

	.buttons {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-top: 0.75rem;
	}

	.problem {
		color: #9b2c2c;
		margin: 0.25rem 0 0;
	}
</style>
