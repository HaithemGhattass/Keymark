// components/Popup/BookmarkListItem.tsx
import { Globe } from "lucide-react";
import type { BookmarkItem } from "../../services/bookmarks";
import { extractDomain, getFaviconUrl } from "../../utils/urlHelpers";

interface BookmarkListItemProps {
  bookmark: BookmarkItem;
  isSelected: boolean;
  onSelect: () => void;
  onOpen: () => void;
}

export function BookmarkListItem({
  bookmark,
  isSelected,
  onSelect,
  onOpen,
}: BookmarkListItemProps) {
  const handleFaviconError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = "none";
    e.currentTarget.nextElementSibling?.classList.remove("hidden");
  };

  return (
    <li
      className={`bookmark-item ${isSelected ? "selected" : ""}`}
      onMouseEnter={onSelect}
      onClick={onOpen}
    >
      <div className="favicon-container">
        <img
          className="favicon-img"
          src={getFaviconUrl(bookmark.url)}
          alt=""
          onError={handleFaviconError}
        />
        <Globe className="favicon-fallback hidden" size={16} />
      </div>

      <div className="bookmark-content">
        <span className="bookmark-title">{bookmark.title || bookmark.url}</span>
        <span className="bookmark-domain">{extractDomain(bookmark.url)}</span>
      </div>

      {isSelected && <span className="enter-badge">↵</span>}
    </li>
  );
}
