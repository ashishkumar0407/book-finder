import React from "react";

/**
 * BookCard
 * displays cover, title, authors, year and favorite toggle
 */
export default function BookCard({ book, isFav = false, onToggleFav }) {
  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : null;

  const authors = book.author_name ? book.author_name.join(", ") : "Unknown author";

  return (
    <article className="bg-white p-4 rounded-lg shadow-sm flex flex-col">
      <div className="mb-3">
        {coverUrl ? (
          <img src={coverUrl} alt={`${book.title} cover`} className="book-cover" />
        ) : (
          <div className="book-cover flex items-center justify-center bg-gray-100 text-gray-500">
            <span>No cover</span>
          </div>
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-lg">{book.title}</h3>
        <p className="text-sm text-gray-600">{authors}</p>
        <p className="text-xs text-gray-500 mt-2">First publish year: {book.first_publish_year || "—"}</p>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={onToggleFav}
          className={`px-3 py-1 rounded-md border ${isFav ? "bg-yellow-400 text-black" : "bg-white hover:bg-gray-50"}`}
          aria-pressed={isFav}
        >
          {isFav ? "★ Favorited" : "☆ Favorite"}
        </button>

        <a
          href={`https://openlibrary.org${book.key}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          View on OpenLibrary
        </a>
      </div>
    </article>
  );
}
