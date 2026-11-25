import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { loadShelves } from './store.js';

function App() {
  const [shelves, setShelves] = useState([]);
  useEffect(() => {
    loadShelves().then(setShelves);
  }, []);
  return (
    <main>
      <h1>Shelf</h1>
      {shelves.map((shelf) => (
        <section key={shelf.name}>
          <h2>{shelf.name}</h2>
          <p>{shelf.books.length} books</p>
        </section>
      ))}
    </main>
  );
}

render(<App />, document.getElementById('app'));
