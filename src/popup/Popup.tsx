import { useEffect, useState } from "react";
import { getAllBookmarks } from "../services/bookmarks";
import type { BookmarkItem } from "../services/bookmarks";
export default function Popup() {
  const [query, setQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    getAllBookmarks().then(setBookmarks);
  }, []);

  const filtered = bookmarks.filter((b) =>
    b.title.toLowerCase().includes(query.toLowerCase())
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!filtered.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((prev) => Math.min(prev + 1, filtered.length - 1));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((prev) => Math.max(prev - 1, 0));
    }

    if (e.key === "Enter") {
      chrome.tabs.create({ url: filtered[selected].url });
    }
  };

  return (
    <div className="container">
      <input
        autoFocus
        className="search"
        placeholder="Search bookmarks..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelected(0); // reset selection on new search
        }}
        onKeyDown={onKeyDown}
      />

      <ul className="list">
        {filtered.slice(0, 8).map((b, index) => (
          <li
            key={b.id}
            className={index === selected ? "active" : ""}
          >
            {b.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
