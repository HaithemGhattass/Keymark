export type BookmarkItem = {
  id: string;
  title: string;
  url: string;
};

export function getAllBookmarks(): Promise<BookmarkItem[]> {
  return new Promise((resolve) => {
    chrome.bookmarks.getTree((tree) => {
      const results: BookmarkItem[] = [];

      function traverse(nodes: chrome.bookmarks.BookmarkTreeNode[]) {
        for (const node of nodes) {
          if (node.url) {
            results.push({
              id: node.id,
              title: node.title,
              url: node.url,
            });
          }
          if (node.children) {
            traverse(node.children);
          }
        }
      }

      traverse(tree);
      resolve(results);
    });
  });
}
