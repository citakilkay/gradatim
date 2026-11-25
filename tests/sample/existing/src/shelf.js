import { createServer } from 'node:http';

const books = [];

const escape = (text) => String(text).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

// The page: a form that adds a book by its title, and every book with its shelf.
const page = () => `<!doctype html>
<meta charset="utf-8">
<title>Shelf</title>
<h1>Shelf</h1>
<form method="post" action="/books">
  <input name="title" placeholder="Title" required>
  <button>Add</button>
</form>
<ul>
${books.map((book) => `  <li>${escape(book.title)} · ${escape(book.shelf)}</li>`).join('\n')}
</ul>
`;

createServer((request, response) => {
  if (request.method === 'POST' && request.url === '/books') {
    let body = '';
    request.on('data', (chunk) => (body += chunk));
    request.on('end', () => {
      const form = request.headers['content-type']?.startsWith('application/x-www-form-urlencoded');
      const title = form ? new URLSearchParams(body).get('title') : JSON.parse(body).title;
      // Every book starts on "To read". TODO: shelves the reader names, and moving a book between them.
      books.push({ title, shelf: 'To read' });
      if (form) response.writeHead(303, { location: '/' }).end();
      else response.writeHead(201).end();
    });
    return;
  }
  if (request.url === '/books') {
    response.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify(books));
    return;
  }
  response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end(page());
}).listen(3000);
