import { createListenerMiddleware, createSlice } from '@reduxjs/toolkit';
import { favoritesStorage } from '../../services/storageService';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: { uid: null, ids: [] },
  reducers: {
    favoritesLoaded(state, action) {
      state.uid = action.payload.uid;
      state.ids = action.payload.ids;
    },
    toggleFavorite(state, action) {
      const id = action.payload;
      state.ids = state.ids.includes(id) ? state.ids.filter((item) => item !== id) : [...state.ids, id];
    },
  },
});

export const { favoritesLoaded, toggleFavorite } = favoritesSlice.actions;

export const loadFavorites = (uid) => (dispatch) =>
  dispatch(favoritesLoaded({ uid, ids: uid ? favoritesStorage.get(uid) : [] }));

export const favoritesListener = createListenerMiddleware();
favoritesListener.startListening({
  actionCreator: toggleFavorite,
  effect: (action, api) => {
    const { uid, ids } = api.getState().favorites;
    if (uid) favoritesStorage.set(uid, ids);
  },
});

export default favoritesSlice.reducer;
