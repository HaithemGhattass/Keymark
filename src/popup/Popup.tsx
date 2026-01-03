import { useState } from "react";
import { SearchInput } from "./ui/SearchInput";
import { BookmarkList } from "./ui/BookmarkList";
import { useBookmarks } from "../hooks/useBookmarks";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import { useTheme } from "../hooks/useTheme";

export default function Popup() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);

  const { theme, toggleTheme } = useTheme();

  const { flatList, grouped, openBookmark } = useBookmarks(query);

  useKeyboardNavigation({
    flatList,
    setSelected,
  });

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    setSelected(0);
  };

  const handleClear = () => {
    setQuery("");
    setSelected(0);
  };

  return (
    <div className="bookmark-search-container">
      <div className="search-row">
        <SearchInput
          query={query}
          onQueryChange={handleQueryChange}
          onClear={handleClear}
          onKeyDown={(e) => {
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
          }}
        />
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>

      <BookmarkList
        grouped={grouped}
        flatList={flatList}
        selected={selected}
        onSelect={setSelected}
        onOpen={openBookmark}
      />
    </div>
  );
}
