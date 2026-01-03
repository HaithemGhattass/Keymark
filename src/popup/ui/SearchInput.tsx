import { Search, X } from "lucide-react";

interface SearchInputProps {
  query: string;
  onQueryChange: (query: string) => void;
  onClear: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function SearchInput({
  query,
  onQueryChange,
  onClear,
  onKeyDown,
}: SearchInputProps) {
  return (
    <div className="search-input-wrapper">
      <Search className="search-icon" />
      <input
        autoFocus
        className="search-input"
        placeholder="Search bookmarks..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
      {query && (
        <button className="clear-button" onClick={onClear} aria-label="Clear search">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
