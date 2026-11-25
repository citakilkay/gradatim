<script lang="ts">
	import { liveQuery } from 'dexie';
	import { appTitle } from '#lib/app-title.ts';
	import { addShelf, deleteShelf, moveShelf, renameShelf, watchShelves, type ShelfRefusal } from '#lib/shelves.ts';
	import { db, type Shelf } from '#lib/store/db.ts';

	const shelves = watchShelves();
	// Every book on the device, in the order added; each shelf below shows its own.
	const books = liveQuery(() => db.books.filter((book) => !book.deleted).sortBy('addedAt'));

	const REFUSED: Record<ShelfRefusal, string> = {
		blank: 'A shelf needs a name.',
		taken: 'Another shelf has that name.',
		finished: 'The Finished shelf stays: it holds the books you have read.',
		'has-books': 'This shelf holds books: move them to another shelf first.'
	};

	let renaming = $state<string | null>(null);
	let draft = $state('');
	let newShelf = $state('');
	// A refused change, said beside its shelf, or under the new shelf's field.
	let refusal = $state<{ shelfId: string | null; message: string } | null>(null);

	const booksOn = (shelfId: string) => ($books ?? []).filter((book) => book.shelfId === shelfId);

	function startRename(shelf: Shelf) {
		renaming = shelf.id;
		draft = shelf.name;
		refusal = null;
	}

	async function saveRename(event: SubmitEvent, shelf: Shelf) {
		event.preventDefault();
		const result = await renameShelf(shelf.id, draft);
		if (result.ok) {
			renaming = null;
			refusal = null;
		} else refusal = { shelfId: shelf.id, message: REFUSED[result.reason] };
	}

	async function remove(shelf: Shelf) {
		const result = await deleteShelf(shelf.id);
		refusal = result.ok ? null : { shelfId: shelf.id, message: REFUSED[result.reason] };
	}

	async function add(event: SubmitEvent) {
		event.preventDefault();
		const result = await addShelf(newShelf);
		if (result.ok) {
			newShelf = '';
			refusal = null;
		} else refusal = { shelfId: null, message: REFUSED[result.reason] };
	}
</script>

<header class="top">
	<h1>{appTitle()}</h1>
	<a class="add-book" href="/add">Add a book</a>
</header>

{#each $shelves ?? [] as shelf, i (shelf.id)}
	<section class="shelf" aria-labelledby="shelf-{shelf.id}">
		<div class="head">
			<h2 id="shelf-{shelf.id}">{shelf.name}</h2>
			{#if shelf.isFinished}
				<span class="mark">the finished shelf</span>
			{/if}
			<div class="actions">
				<button type="button" aria-label="Rename {shelf.name}" onclick={() => startRename(shelf)}>Rename</button>
				<button type="button" aria-label="Move {shelf.name} up" disabled={i === 0} onclick={() => moveShelf(shelf.id, 'up')}>Up</button>
				<button
					type="button"
					aria-label="Move {shelf.name} down"
					disabled={i === ($shelves ?? []).length - 1}
					onclick={() => moveShelf(shelf.id, 'down')}>Down</button
				>
				<button type="button" aria-label="Delete {shelf.name}" onclick={() => remove(shelf)}>Delete</button>
			</div>
		</div>
		{#if renaming === shelf.id}
			<form class="inline" onsubmit={(event) => saveRename(event, shelf)}>
				<label for="rename-{shelf.id}">New name for {shelf.name}</label>
				<input id="rename-{shelf.id}" bind:value={draft} />
				<button type="submit">Save</button>
				<button type="button" onclick={() => (renaming = null)}>Cancel</button>
			</form>
		{/if}
		{#if refusal && refusal.shelfId === shelf.id}
			<p class="refusal" role="alert">{refusal.message}</p>
		{/if}
		<ul class="books">
			{#each booksOn(shelf.id) as book (book.id)}
				<li>{book.title ?? `ISBN ${book.isbn}`}</li>
			{/each}
		</ul>
	</section>
{/each}

<form class="inline new-shelf" onsubmit={add}>
	<label for="new-shelf">New shelf</label>
	<input id="new-shelf" bind:value={newShelf} />
	<button type="submit">Add shelf</button>
</form>
{#if refusal && refusal.shelfId === null}
	<p class="refusal" role="alert">{refusal.message}</p>
{/if}

<style>
	.top {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem 1rem;
	}

	.top h1 {
		margin: 0.5rem 0;
	}

	.add-book {
		background: #3d5a40;
		color: #fff;
		border-radius: 6px;
		padding: 0.4rem 0.9rem;
		text-decoration: none;
	}

	.shelf {
		background: #fff;
		border: 1px solid #e3ddd2;
		border-radius: 10px;
		padding: 0.75rem 1rem;
		margin: 1rem 0;
	}

	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
	}

	.head h2 {
		margin: 0;
		font-size: 1.15rem;
	}

	.mark {
		border: 1px solid #c9d6c3;
		border-radius: 999px;
		color: #3d5a40;
		font-size: 0.75rem;
		padding: 0 0.5rem;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		margin-left: auto;
	}

	.books {
		list-style: none;
		margin: 0.5rem 0 0;
		padding: 0;
		min-height: 4.5rem;
	}

	.books li {
		border-bottom: 1px solid #f0ebe2;
		padding: 0.35rem 0;
	}

	.inline {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.new-shelf {
		margin-top: 1.5rem;
	}

	.refusal {
		color: #9b2c2c;
		margin: 0.5rem 0 0;
	}
</style>
