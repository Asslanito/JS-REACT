import { useCallback, useEffect, useState } from 'react';
import { themeStorage } from '../services/storageService';

export function useTheme() {
  const [theme, setTheme] = useState(
    () => themeStorage.get() || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    themeStorage.set(theme);
  }, [theme]);
  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);
  return { theme, toggle };
}
