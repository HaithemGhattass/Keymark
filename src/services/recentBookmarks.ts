import type { BookmarkItem } from "./bookmarks";

const STORAGE_KEY = "keymark_recent";
const MAX_RECENTS = 10;

export function getRecentBookmarks(): Promise<BookmarkItem[]> {
  return new Promise((resolve) => {
    chrome.storage.local.get(STORAGE_KEY, (result) => {
      const items = result[STORAGE_KEY];
      resolve(Array.isArray(items) ? items : []);
    });
  });
}


export async function addRecentBookmark(bookmark: BookmarkItem) {
  const recents = await getRecentBookmarks();

  const filtered = recents.filter((b) => b.url !== bookmark.url);

  const updated = [bookmark, ...filtered].slice(0, MAX_RECENTS);

  chrome.storage.local.set({
    [STORAGE_KEY]: updated,
  });
}
