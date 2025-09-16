import React, { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import BookCard from "./components/BookCard";
import Loading from "./components/Loading";
import Favorites from "./components/Favorites";

/**
 * Main App
 * - uses only useState and useEffect
 * - fetches OpenLibrary search.json
 * - supports search by title or author
 * - handles pagination via page param & "Load More"
 * - saves favorites in localStorage
 */
export default function App() {
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("title"); // 'title' | 'author'
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // favorites persisted to localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  });

  // sync favorites to localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Build the OpenLibrary URL and fetch results
  async function fetchBooks(q, by = "title", pageToFetch = 1, replace = false) {
    if (!q || q.trim() === "") {
      setError("Please enter a search term.");
      setBooks([]);
      setHasMore(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const encoded = encodeURIComponent(q.trim());
      let url = "";
      if (by === "title") url = `https://openlibrary.org/search.json?title=${encoded}&page=${pageToFetch}`;
      else if (by === "author") url = `https://openlibrary.org/search.json?author=${encoded}&page=${pageToFetch}`;
      else url = `https://openlibrary.org/search.json?q=${encoded}&page=${pageToFetch}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`API returned status ${res.status}`);
      const data = await res.json();

      const docs = data.docs || [];

      if (docs.length === 0 && pageToFetch === 1) {
        setBooks([]);
        setError("No results found.");
        setHasMore(false);
      } else {
        setBooks(prev => (replace ? docs : [...prev, ...docs]));
        // OpenLibrary returns numFound and start — compute if there's more
        const start = typeof data.start === "number" ? data.start : (pageToFetch - 1) * docs.length;
        setHasMore((start + docs.length) < (data.numFound || 0));
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong during fetch.");
    } finally {
      setLoading(false);
    }
  }

  // Handler invoked by SearchBar
  const handleSearch = (q, by) => {
    setQuery(q);
    setSearchBy(by);
    setPage(1);
    // replace current results
    fetchBooks(q, by, 1, true);
  };

  // Load more (pagination)
  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchBooks(query, searchBy, next, false);
  };

  // Toggle favorites (by a stable key)
  const toggleFavorite = (book) => {
    // create a small stable record for the favorite
    const key = book.key || book.cover_edition_key || `${book.title}-${book.first_publish_year || ""}`;

    setFavorites(prev => {
      if (prev.some(b => b.key === key)) {
        return prev.filter(b => b.key !== key); // remove
      } else {
        const toSave = {
          key,
          title: book.title,
          author_name: book.author_name,
          first_publish_year: book.first_publish_year,
          cover_i: book.cover_i,
        };
        return [toSave, ...prev];
      }
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">📚 Book Finder</h1>
        <p className="text-sm text-gray-600 mb-6">Search books using the Open Library API — title or author. Try "harry potter".</p>

        <SearchBar onSearch={handleSearch} initialType={searchBy} />
      </header>

      <main className="max-w-5xl mx-auto mt-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Results */}
          <section className="flex-1">
            {error && <div className="text-red-600 mb-4">{error}</div>}
            {loading && page === 1 ? (
              <Loading />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {books.map((b) => (
                    <BookCard
                      key={b.key || b.cover_edition_key || `${b.title}-${b.first_publish_year}`}
                      book={b}
                      isFav={favorites.some(f => f.key === (b.key || b.cover_edition_key || `${b.title}-${b.first_publish_year || ""}`))}
                      onToggleFav={() => toggleFavorite(b)}
                    />
                  ))}
                </div>

                {/* Loading spinner for subsequent pages */}
                {loading && page > 1 && <div className="mt-4"><Loading /></div>}

                {/* Load more button */}
                {hasMore && !loading && (
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={handleLoadMore}
                      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      Load more
                    </button>
                  </div>
                )}
              </>
            )}
          </section>

          {/* Favorites sidebar */}
          <aside className="w-full md:w-80">
            <Favorites favorites={favorites} onToggle={toggleFavorite} />
          </aside>
        </div>
      </main>

      <footer className="max-w-5xl mx-auto mt-10 text-center text-sm text-gray-500">
        Built with ❤️ · Uses Open Library API
      </footer>
    </div>
  );
}
