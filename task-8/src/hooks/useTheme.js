import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../features/theme/themeSlice';
import { themeStorage } from '../services/storageService';

export function useTheme() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    themeStorage.set(theme);
  }, [theme]);
  return { theme, toggle: () => dispatch(toggleTheme()) };
}
