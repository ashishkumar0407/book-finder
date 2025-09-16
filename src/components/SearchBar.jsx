import React, { useState } from "react";

/**
 * SearchBar
 * props:
 *  - onSearch(query, by) callback
 *  - initialType ('title'|'author')
 */
export default function SearchBar({ onSearch, initialType = "title" }) {
  const [q, setQ] = useState("");
  const [by, setBy] = useState(initialType);

  function submit(e) {
    e.preventDefault();
    onSearch(q, by);
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <div className="flex-1 flex items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search by ${by} (e.g. "harry potter")`}
          className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <select
          value={by}
          onChange={(e) => setBy(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="title">Title</option>
          <option value="author">Author</option>
        </select>
      </div>

      <button
        type="submit"
        className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Search
      </button>
    </form>
  );
}
