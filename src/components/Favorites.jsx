import React from "react";

/**
 * Favorites list — simple compact view
 */
export default function Favorites({ favorites = [], onToggle }) {
  return (
    <div className="sticky top-6 bg-white p-4 rounded-lg shadow-sm">
      <h2 className="font-semibold mb-3">★ Favorites</h2>

      {favorites.length === 0 ? (
        <p className="text-sm text-gray-500">No favorites yet. Click "Favorite" on a book.</p>
      ) : (
        <ul className="space-y-3">
          {favorites.map((f) => (
            <li key={f.key} className="flex items-center gap-3">
              <div className="w-12 h-16 flex-shrink-0 overflow-hidden rounded">
                {f.cover_i ? (
                  <img
                    src={`https://covers.openlibrary.org/b/id/${f.cover_i}-S.jpg`}
                    alt={f.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-xs text-gray-500">
                    No cover
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="text-sm font-medium">{f.title}</div>
                <div className="text-xs text-gray-500">{(f.author_name || []).slice(0,2).join(", ")}</div>
              </div>

              <button
                onClick={() => onToggle({ key: f.key })}
                className="text-xs px-2 py-1 border rounded text-red-600"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
