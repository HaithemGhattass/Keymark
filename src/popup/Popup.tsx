import { useEffect, useState } from "react";
import { getAllBookmarks } from "../services/bookmarks";
import type { BookmarkItem } from "../services/bookmarks";
import { initFuzzySearch, searchBookmarks } from "../services/fuzzySearch";

export default function Popup() {
  const [query, setQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    getAllBookmarks().then((data) => {
      setBookmarks(data);
      initFuzzySearch(data);
      // Debug: confirm popup mounted and bookmarks loaded in popup DevTools console
      try {
        console.debug("Keymark popup mounted — bookmarks:", data.length);
      } catch (e) {
        /* ignore */
      }
    });
  }, []);

  const filtered = query ? searchBookmarks(query) : bookmarks.slice(0, 10);

  // Keep selection within bounds when the filtered list changes
  useEffect(() => {
    setSelected((prev) => Math.max(0, Math.min(prev, Math.max(0, filtered.length - 1))));
  }, [filtered.length]);

  const openBookmark = (b: BookmarkItem) => {
    try {
      chrome.tabs.create({ url: b.url });
    } catch (e) {
      console.error("Failed to open bookmark", e);
    }
  };

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
      e.preventDefault();
      openBookmark(filtered[selected]);
    }
  };

  const extractDomain = (url: string) => {
    try {
      const u = new URL(url);
      return u.hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  };

  const faviconFor = (url: string) =>
    `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(url)}`;

  return (
    <div className="container">
      <div className="searchRow">
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
        {query && (
          <button
            className="clear"
            aria-label="Clear"
            onClick={() => {
              setQuery("");
              setSelected(0);
            }}
          >
            ✕
          </button>
        )}
      </div>

      <ul className="list" role="listbox" aria-activedescendant={`item-${selected}`}>
        {filtered.slice(0, 10).map((b, index) => (
          <li
            id={`item-${index}`}
            key={b.id}
            className={index === selected ? "item active" : "item"}
            role="option"
            aria-selected={index === selected}
            onMouseEnter={() => setSelected(index)}
            onClick={() => openBookmark(b)}
          >
            <img className="favicon" src={faviconFor(b.url)} alt="" />
            <div className="meta">
              <div className="title">{b.title || b.url}</div>
              <div className="domain">{extractDomain(b.url)}</div>
            </div>
          </li>
        ))}
        {filtered.length === 0 && <li className="empty">No bookmarks found</li>}
      </ul>
    </div>
  );
}
