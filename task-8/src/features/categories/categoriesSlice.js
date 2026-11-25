import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { productsApi } from '../../services/productsService';

export const fetchCategories = createAsyncThunk(
  'categories/fetch',
  (arg, { signal }) => productsApi.categories(signal),
  {
    condition: (arg, { getState }) => {
      const { status } = getState().categories;
      if (arg?.force) return status !== 'loading';
      return status === 'idle' || status === 'failed';
    },
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectCategoriesMeta = (state) => state.categories;
export const selectCategoryOptions = createSelector(
  [(state) => state.categories.items],
  (items) => items.map(({ slug, name }) => ({ slug, name }))
);

export default categoriesSlice.reducer;
