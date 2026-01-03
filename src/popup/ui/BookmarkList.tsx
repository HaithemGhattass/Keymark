import { useEffect, useRef } from "react";
import { BookmarkGroup } from "./BookmarkGroup";
import { EmptyState } from "./EmptyState";
import type { BookmarkItem } from "../../services/bookmarks";
import type { GroupedBookmarks } from "../../utils/groupBySite";

interface BookmarkListProps {
  grouped: GroupedBookmarks[];
  flatList: BookmarkItem[];
  selected: number;
  onSelect: (index: number) => void;
  onOpen: (bookmark: BookmarkItem) => void;
}

export function BookmarkList({
  grouped,
  flatList,
  selected,
  onSelect,
  onOpen,
}: BookmarkListProps) {
  if (flatList.length === 0) {
    return (
      <ul className="results-list" role="listbox">
        <EmptyState />
      </ul>
    );
  }

  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (selected == null) return;
    const root = listRef.current;
    if (!root) return;

    const el = root.querySelector(`[data-index="${selected}"]`) as HTMLElement | null;
    if (!el) return;

    el.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [selected]);

  return (
    <ul className="results-list" role="listbox" ref={listRef}>
      {grouped.map((group) => (
        <BookmarkGroup
          key={group.site}
          group={group}
          flatList={flatList}
          selected={selected}
          onSelect={onSelect}
          onOpen={onOpen}
        />
      ))}
    </ul>
  );
}
