// Gradatim demo: draft
// <What it shows, in one sentence>, drawn from <the task's criteria | the stories delivered | the user's words>.
export const app = { start: '<the command that serves the app>', url: '<its address>' };
export const size = { width: 1280, height: 720 };

// Five beats: entry, context, action, variation, result. Each opens with its card: a title, and one line on what the
// viewer sees. Only locators that discover printed; a select by its label; one tab.
// The helpers: chapter(title, line), goto(path), click(locator), fill(locator, text), choose(locator, label),
// see(locator), scroll(locator), pause(ms), and end(), which holds the last screen.
export default async (page, demo) => {
  // Entry: where a user starts.
  await demo.chapter('<a title>', '<what the viewer sees, under 60 characters>');
  await demo.goto('/');

  // Context: what is around them, so the viewer knows where they are.
  await demo.chapter('<a title>', '<a line>');
  await demo.see(page.getByRole('<role>', { name: '<its name>' }));

  // Action: the main thing the demo shows.
  await demo.chapter('<a title>', '<a line>');
  await demo.click(page.getByRole('<role>', { name: '<its name>' }));
  await demo.fill(page.getByLabel('<its label>'), '<what a user types>');

  // Variation: a second path or feature, such as a setting.
  await demo.chapter('<a title>', '<a line>');

  // Result: the outcome, held at the end.
  await demo.chapter('<a title>', '<a line>');
  await demo.end();
};
