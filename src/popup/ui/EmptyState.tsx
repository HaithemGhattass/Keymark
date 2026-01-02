import { Bookmark } from "lucide-react";

export function EmptyState() {
  return (
    <li className="empty-state">
      <Bookmark className="empty-icon" />
      <span>No bookmarks found</span>
    </li>
  );
}
