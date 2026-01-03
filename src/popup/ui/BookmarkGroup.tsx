import { BookmarkListItem } from "./BookmarkListItem";
import type { BookmarkItem } from "../../services/bookmarks";
import type { GroupedBookmarks } from "../../utils/groupBySite";

interface BookmarkGroupProps {
  group: GroupedBookmarks;
  flatList: BookmarkItem[];
  selected: number;
  onSelect: (index: number) => void;
  onOpen: (bookmark: BookmarkItem) => void;
}

export function BookmarkGroup({
  group,
  flatList,
  selected,
  onSelect,
  onOpen,
}: BookmarkGroupProps) {
  return (
    <div key={group.site}>
      <div className="site-header">{group.site}</div>
      {group.items.map((bookmark) => {
        const index = flatList.findIndex((item) => item.id === bookmark.id);

        return (
          <BookmarkListItem
            key={bookmark.id}
            index={index}
            bookmark={bookmark}
            isSelected={index === selected}
            onSelect={() => onSelect(index)}
            onOpen={() => onOpen(bookmark)}
          />
        );
      })}
    </div>
  );
}
