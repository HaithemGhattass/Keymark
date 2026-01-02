import { useEffect, useState } from "react";
import { getAllBookmarks } from "../services/bookmarks";
import type { BookmarkItem } from "../services/bookmarks";
import { initFuzzySearch, searchBookmarks } from "../services/fuzzySearch";
import { Search, X, Bookmark, Globe } from "lucide-react";
import {
  getRecentBookmarks,
  addRecentBookmark,
} from "../services/recentBookmarks";
import { groupBySite, type GroupedBookmarks } from "../utils/groupBySite";

export default function Popup() {
  const [query, setQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [recent, setRecent] = useState<BookmarkItem[]>([]);
  const [selected, setSelected] = useState(0);

  // Load bookmarks
  useEffect(() => {
    getAllBookmarks().then((data) => {
      setBookmarks(data);
      initFuzzySearch(data);
    });
    getRecentBookmarks().then(setRecent);
  }, []);

  // Visible bookmarks (search or recent + rest)
  const visibleBookmarks = query
    ? searchBookmarks(query)
    : [
        ...recent,
        ...bookmarks.filter((b) => !recent.some((r) => r.url === b.url)),
      ].slice(0, 20);

  const grouped: GroupedBookmarks[] = groupBySite(visibleBookmarks);
  const flatList: BookmarkItem[] = grouped.flatMap(
    (g: GroupedBookmarks) => g.items
  );

  // Clamp selection safely
  useEffect(() => {
    setSelected((prev) =>
      Math.max(0, Math.min(prev, Math.max(0, flatList.length - 1)))
    );
  }, [flatList.length]);

  const openBookmark = async (b: BookmarkItem) => {
    try {
      await addRecentBookmark(b);
      chrome.tabs.create({ url: b.url });
    } catch (e) {
      console.error("Failed to open bookmark", e);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!flatList.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((prev) => Math.min(prev + 1, flatList.length - 1));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((prev) => Math.max(prev - 1, 0));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      openBookmark(flatList[selected]);
    }
  };

  const extractDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
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
      {/* Search */}
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
            onClick={() => {
              setQuery("");
              setSelected(0);
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>


      <ul className="results-list" role="listbox">
        {grouped.map((group: GroupedBookmarks) => (
          <div key={group.site}>
            <div className="site-header">{group.site}</div>

            {group.items.map((b: BookmarkItem) => {
              const index = flatList.findIndex(
                (item: BookmarkItem) => item.id === b.id
              );

              return (
                <li
                  key={b.id}
                  className={`bookmark-item ${
                    index === selected ? "selected" : ""
                  }`}
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
                    <span className="bookmark-domain">
                      {extractDomain(b.url)}
                    </span>
                  </div>

                  {index === selected && <span className="enter-badge">↵</span>}
                </li>
              );
            })}
          </div>
        ))}

        {flatList.length === 0 && (
          <li className="empty-state">
            <Bookmark className="empty-icon" />
            <span>No bookmarks found</span>
          </li>
        )}
      </ul>
    </div>
  );
}
