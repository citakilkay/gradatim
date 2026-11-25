// Gradatim demo: final, 2026-11-14
// A reader adds a book to a shelf by its ISBN, and a wrong ISBN is refused, drawn from the task's criteria (BOK-3).
export const app = { start: 'npm run build && npm run preview -- --port 4173 --strictPort', url: 'http://localhost:4173' };
export const size = { width: 1280, height: 720 };

export default async (page, demo) => {
  // Entry: where a user starts.
  await demo.chapter('Your shelves', 'Shelf opens on the shelves you named');
  await demo.goto('/');

  // Context: what is around them.
  await demo.chapter('Three shelves, no books yet', 'Reading, To read and Finished, each empty');
  await demo.see(page.getByRole('region', { name: 'To read' }));
  await demo.click(page.getByRole('link', { name: 'Add a book' }));

  // Action: the main thing the demo shows.
  await demo.chapter('Add a book by its ISBN', 'Type the ISBN and pick the shelf it goes on');
  await demo.fill(page.getByLabel('ISBN'), '978-0-14-044913-7');
  await demo.choose(page.getByLabel('Shelf'), 'To read');
  await demo.click(page.getByRole('button', { name: 'Add' }));

  // Variation: a wrong ISBN is refused, and nothing is saved.
  await demo.chapter('A wrong ISBN is refused', 'A typo in the check digit: Shelf says so and saves nothing');
  await demo.see(page.getByRole('heading', { level: 1, name: 'Add a book' }));
  await demo.fill(page.getByLabel('ISBN'), '978-0-14-044913-6');
  await demo.click(page.getByRole('button', { name: 'Add' }));

  // Result: the outcome, held at the end.
  await demo.chapter('On its shelf at once', 'The book shows on To read by its ISBN');
  await demo.see(page.getByRole('region', { name: 'To read' }));
  await demo.end();
};
