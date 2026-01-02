import type { BookmarkItem } from "../services/bookmarks";

export type GroupedBookmarks = {
  site: string;
  items: BookmarkItem[];
};

export function groupBySite(
  bookmarks: BookmarkItem[]
): GroupedBookmarks[] {
  const map = new Map<string, BookmarkItem[]>();

  for (const b of bookmarks) {
    try {
      const domain = new URL(b.url).hostname.replace(/^www\./, "");
      if (!map.has(domain)) {
        map.set(domain, []);
      }
      map.get(domain)!.push(b);
    } catch {
      // ignore invalid URLs
    }
  }

  return Array.from(map.entries()).map(([site, items]) => ({
    site,
    items,
  }));
}
