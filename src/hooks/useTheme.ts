import { useEffect, useState } from "react";

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = () => {
    try {
      chrome.storage?.sync?.get(["theme"], (res) => {
        const storedTheme = res?.theme as Theme | undefined;
        const finalTheme = storedTheme ?? getSystemTheme();
        applyTheme(finalTheme);
        setTheme(finalTheme);
      });
    } catch (e) {
      const systemTheme = getSystemTheme();
      applyTheme(systemTheme);
      setTheme(systemTheme);
    }
  };

  const getSystemTheme = (): Theme => {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? 'dark'
      : 'light';
  };

  const applyTheme = (theme: Theme) => {
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error('Failed to apply theme', e);
    }
  };

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    applyTheme(nextTheme);
    
    try {
      chrome.storage?.sync?.set({ theme: nextTheme });
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  };

  return {
    theme,
    toggleTheme,
    isLoading: theme === null,
  };
}