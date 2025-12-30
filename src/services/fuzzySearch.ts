import Fuse from "fuse.js";
import type { BookmarkItem } from "./bookmarks";

let fuse: Fuse<BookmarkItem> | null = null;

export function initFuzzySearch(bookmarks: BookmarkItem[]) {
  fuse = new Fuse(bookmarks, {
    keys: ["title", "url"],
    threshold: 0.4,
    ignoreLocation: true,
    minMatchCharLength: 2,
  });
}

export function searchBookmarks(query: string): BookmarkItem[] {
  if (!fuse || !query) return [];
  return fuse.search(query).map((result) => result.item);
}
