// Looks a book up by its ISBN in Open Library, and returns its title and its cover ids.
export async function lookup(isbn) {
  const response = await fetch(`https://openlibrary.org/isbn/${isbn}.json`);
  if (!response.ok) return null;
  const edition = await response.json();
  return { title: edition.title, covers: edition.covers ?? [] };
}
