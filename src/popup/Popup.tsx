import { useEffect, useState } from "react";
import { getAllBookmarks } from "../services/bookmarks";
import type { BookmarkItem } from "../services/bookmarks";
import { initFuzzySearch, searchBookmarks } from "../services/fuzzySearch";
import { Search, X, Bookmark, Globe } from "lucide-react";

export default function Popup() {
  const [query, setQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    getAllBookmarks().then((data) => {
      setBookmarks(data);
      initFuzzySearch(data);
    });
  }, []);

  const filtered = query ? searchBookmarks(query) : bookmarks.slice(0, 10);

  // Keep selection within bounds when the filtered list changes
  useEffect(() => {
    setSelected((prev) =>
      Math.max(0, Math.min(prev, Math.max(0, filtered.length - 1)))
    );
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
    `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(
      url
    )}`;

  return (
    <div className="bookmark-search-container">
      {/* Search Input */}
      <div className="search-input-wrapper">
        <Search className="search-icon" />
        <input
          autoFocus
          className="search-input"
          placeholder="Search bookmarks..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(0);
          }}
          onKeyDown={onKeyDown}
        />
        {query && (
          <button
            className="clear-button"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              setSelected(0);
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="divider" />

      <ul
        className="results-list"
        role="listbox"
        aria-activedescendant={`item-${selected}`}
      >
        {filtered.slice(0, 10).map((b, index) => (
          <li
            id={`item-${index}`}
            key={b.id}
            className={`bookmark-item ${index === selected ? "selected" : ""}`}
            role="option"
            aria-selected={index === selected}
            onMouseEnter={() => setSelected(index)}
            onClick={() => openBookmark(b)}
          >
            <div className="favicon-container">
              <img
                className="favicon-img"
                src={faviconFor(b.url)}
                alt=""
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove(
                    "hidden"
                  );
                }}
              />
              <Globe className="favicon-fallback hidden" size={16} />
            </div>
            <div className="bookmark-content">
              <span className="bookmark-title">{b.title || b.url}</span>
              <span className="bookmark-domain">{extractDomain(b.url)}</span>
            </div>
            {index === selected && <span className="enter-badge">↵</span>}
          </li>
        ))}

        {filtered.length === 0 && (
          <li className="empty-state">
            <Bookmark className="empty-icon" />
            <span>No bookmarks found</span>
          </li>
        )}
      </ul>

      <div className="footer">
        <div className="footer-item">
          <kbd className="kbd">↑</kbd>
          <kbd className="kbd">↓</kbd>
          <span>navigate</span>
        </div>
        <div className="footer-item">
          <kbd className="kbd">↵</kbd>
          <span>open</span>
        </div>
        <div className="footer-item">
          <kbd className="kbd">esc</kbd>
          <span>close</span>
        </div>
      </div>
    </div>
  );
}
