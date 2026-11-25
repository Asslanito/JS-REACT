import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import {
  createProduct,
  deleteProduct,
  fetchProductById,
  fetchProducts,
  makeKey,
  updateProduct,
} from './productsThunks';

export const productsAdapter = createEntityAdapter();

const initialState = productsAdapter.getInitialState({
  list: { ids: [], total: 0, key: null, status: 'idle', error: null, requestId: null, fetchedAt: null, fromCache: false },
  details: { status: 'idle', error: null, requestId: null, currentId: null, fromCache: false, fetchedAt: {} },
  mutation: { status: 'idle', error: null, requestId: null },
});

const startMutation = (state, action) => {
  state.mutation = { status: 'loading', error: null, requestId: action.meta.requestId };
};
const finishMutation = (state, action) => {
  if (state.mutation.requestId === action.meta.requestId) state.mutation.status = 'succeeded';
};
const failMutation = (state, action) => {
  if (state.mutation.requestId !== action.meta.requestId) return;
  state.mutation.status = 'failed';
  state.mutation.error = action.error.message;
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetMutation(state) {
      state.mutation = { status: 'idle', error: null, requestId: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.list.status = 'loading';
        state.list.error = null;
        state.list.requestId = action.meta.requestId;
        state.list.key = makeKey(action.meta.arg);
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.list.requestId) return;
        const { products, total, fromCache } = action.payload;
        productsAdapter.upsertMany(state, products);
        state.list.ids = products.map((product) => product.id);
        state.list.total = total;
        state.list.fromCache = Boolean(fromCache);
        state.list.status = 'succeeded';
        state.list.fetchedAt = Date.now();
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        if (action.meta.requestId !== state.list.requestId) return;
        state.list.status = action.meta.aborted ? 'idle' : 'failed';
        state.list.error = action.error.message;
      })
      .addCase(fetchProductById.pending, (state, action) => {
        state.details.status = 'loading';
        state.details.error = null;
        state.details.requestId = action.meta.requestId;
        state.details.currentId = String(action.meta.arg.id);
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.details.requestId) return;
        const { product, fromCache } = action.payload;
        productsAdapter.upsertOne(state, product);
        state.details.fetchedAt[product.id] = Date.now();
        state.details.fromCache = Boolean(fromCache);
        state.details.status = 'succeeded';
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        if (action.meta.requestId !== state.details.requestId) return;
        state.details.status = action.meta.aborted ? 'idle' : 'failed';
        state.details.error = action.error.message;
      })
      .addCase(createProduct.pending, startMutation)
      .addCase(createProduct.fulfilled, (state, action) => {
        productsAdapter.upsertOne(state, action.payload);
        state.list.ids.unshift(action.payload.id);
        state.list.total += 1;
        finishMutation(state, action);
      })
      .addCase(createProduct.rejected, failMutation)
      .addCase(updateProduct.pending, startMutation)
      .addCase(updateProduct.fulfilled, (state, action) => {
        productsAdapter.updateOne(state, action.payload);
        finishMutation(state, action);
      })
      .addCase(updateProduct.rejected, failMutation)
      .addCase(deleteProduct.pending, startMutation)
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const id = action.payload;
        productsAdapter.removeOne(state, id);
        state.list.ids = state.list.ids.filter((listId) => listId !== id);
        state.list.total = Math.max(0, state.list.total - 1);
        delete state.details.fetchedAt[id];
        finishMutation(state, action);
      })
      .addCase(deleteProduct.rejected, failMutation);
  },
});

export const { resetMutation } = productsSlice.actions;
export default productsSlice.reducer;
