import { useEffect, useState } from "react";
import { getAllBookmarks, type BookmarkItem } from "../services/bookmarks";
import { initFuzzySearch, searchBookmarks } from "../services/fuzzySearch";
import { getRecentBookmarks, addRecentBookmark } from "../services/recentBookmarks";
import { groupBySite, type GroupedBookmarks } from "../utils/groupBySite";

export function useBookmarks(query: string) {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [recent, setRecent] = useState<BookmarkItem[]>([]);

  useEffect(() => {
    const loadBookmarks = async () => {
      const data = await getAllBookmarks();
      setBookmarks(data);
      initFuzzySearch(data);
    };

    const loadRecent = async () => {
      const data = await getRecentBookmarks();
      setRecent(data);
    };

    loadBookmarks();
    loadRecent();
  }, []);

  const visibleBookmarks = query
    ? searchBookmarks(query)
    : [
        ...recent,
        ...bookmarks.filter((b) => !recent.some((r) => r.url === b.url)),
      ].slice(0, 20);

  const grouped: GroupedBookmarks[] = groupBySite(visibleBookmarks);
  const flatList: BookmarkItem[] = grouped.flatMap((g) => g.items);

  const openBookmark = async (bookmark: BookmarkItem) => {
    try {
      await addRecentBookmark(bookmark);
      chrome.tabs.create({ url: bookmark.url });
    } catch (error) {
      console.error("Failed to open bookmark", error);
    }
  };

  return {
    bookmarks,
    recent,
    visibleBookmarks,
    grouped,
    flatList,
    openBookmark,
  };
}