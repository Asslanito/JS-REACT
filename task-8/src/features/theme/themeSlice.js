import { createSlice } from '@reduxjs/toolkit';
import { themeStorage } from '../../services/storageService';

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: themeStorage.get() === 'dark' ? 'dark' : 'light' },
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
