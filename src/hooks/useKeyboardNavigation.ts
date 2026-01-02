import { useEffect } from "react";
import type { BookmarkItem } from "../services/bookmarks";

interface UseKeyboardNavigationProps {
  flatList: BookmarkItem[];
  setSelected: (value: number | ((prev: number) => number)) => void;
}

export function useKeyboardNavigation({
  flatList,
  setSelected,
}: UseKeyboardNavigationProps) {
  useEffect(() => {
    setSelected((prev) =>
      Math.max(0, Math.min(prev, Math.max(0, flatList.length - 1)))
    );
  }, [flatList.length, setSelected]);
}