// Gradatim demo: final, 2026-11-10
// The footer that every page of Shelf shows, with its version and its report link, drawn from OPS-2's criteria.
export const app = { start: 'npm run build && npm run preview -- --port 4173 --strictPort', url: 'http://localhost:4173' };
export const size = { width: 1280, height: 720 };

// Five beats: entry, context, action, variation, result. Each opens with its card: a title, and one line on what the
// viewer sees.
export default async (page, demo) => {
  // Entry: Shelf's first page.
  await demo.chapter('Shelf', "Shelf's first page, with the version in its footer");
  await demo.goto('/');

  // Context: the page and its name.
  await demo.chapter('The page', 'The app keeps its name at the top');
  await demo.see(page.getByRole('heading', { name: 'Shelf' }));

  // Action: the version in the footer.
  await demo.chapter('The footer', 'The version comes from package.json');
  await demo.scroll(page.getByRole('contentinfo'));
  await demo.see(page.getByText('Shelf version'));

  // Variation: the link to report a problem.
  await demo.chapter('Report a problem', "A link to the project's issues");
  await demo.see(page.getByRole('link', { name: 'Report a problem' }));

  // Result: the footer on every page.
  await demo.chapter('On every page', 'Every page shows the version and the link');
  await demo.end();
};
