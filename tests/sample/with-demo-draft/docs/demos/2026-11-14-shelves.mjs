// Gradatim demo: draft
// Shelf's shelves and its add screen, from a new shelf to a book on it, drawn from the stories delivered.
export const app = { start: 'npm run build && npm run preview -- --port 4173 --strictPort', url: 'http://localhost:4173' };
export const size = { width: 1280, height: 720 };

// Five beats: entry, context, action, variation, result. Each opens with its card: a title, and one line on what the
// viewer sees.
export default async (page, demo) => {
  // Entry: where a reader starts.
  await demo.chapter('Your shelves', 'Three shelves to start: Reading, To read, Finished');
  await demo.goto('/');

  // Context: the shelves and what each can do.
  await demo.chapter('Each shelf', 'Rename a shelf, move it, or delete it');
  await demo.see(page.getByRole('heading', { name: 'To read' }));
  await demo.see(page.getByRole('button', { name: 'Rename To read' }));

  // Action: a shelf of the reader's own.
  await demo.chapter('A shelf of your own', 'Name it, and it joins the end of the list');
  await demo.fill(page.getByRole('textbox', { name: 'New shelf' }), 'Summer 2026');
  await demo.click(page.getByRole('button', { name: 'Add shelf' }));

  // Variation: adding a book by its ISBN.
  await demo.chapter('Add a book', 'Type its ISBN, and pick a shelf');
  await demo.click(page.getByRole('link', { name: 'Add a book' }));
  await demo.fill(page.getByRole('textbox', { name: 'ISBN' }), '9780441013593');
  await demo.choose(page.getByRole('combobox', { name: 'Shelf' }), 'Summer 2026');
  await demo.click(page.getByRole('button', { name: 'Add' }));

  // Result: the book on its shelf.
  await demo.chapter('On its shelf', 'The book waits there for its details');
  await demo.scroll(page.getByRole('region', { name: 'Summer 2026' }));
  await demo.see(page.getByRole('region', { name: 'Summer 2026' }).getByRole('listitem').first());
  await demo.end();
};
