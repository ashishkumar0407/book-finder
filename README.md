# Book Finder (Vite + React + Tailwind)

Search books using the Open Library Search API.

## Features
- Search by title or author
- Loading and error states
- Responsive grid layout
- "Load more" pagination
- Favorite books saved to localStorage

## Run locally
1. `npm install`
2. `npm run dev`
3. Open the URL printed in terminal (e.g. http://localhost:5173)

## Deploy
- CodeSandbox: import repository or create a new Vite + React sandbox. Add Tailwind (or use the Vite + Tailwind template).
- StackBlitz: create a new Vite React project (or import repo). Add Tailwind as devDependency and include Tailwind config & index.css.

## Notes
- Uses Open Library Search API: `https://openlibrary.org/search.json`.
- Book cover images: `https://covers.openlibrary.org/b/id/{cover_i}-M.jpg`.
