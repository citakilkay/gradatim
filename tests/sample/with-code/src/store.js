import { get, set } from 'idb-keyval';

const KEY = 'shelves';
const STARTING_SHELVES = [
  { name: 'Reading', books: [] },
  { name: 'To read', books: [] },
  { name: 'Finished', books: [] },
];

// The shelves live in the browser's IndexedDB, so they work offline.
export async function loadShelves() {
  return (await get(KEY)) ?? STARTING_SHELVES;
}

export async function saveShelves(shelves) {
  await set(KEY, shelves);
}
