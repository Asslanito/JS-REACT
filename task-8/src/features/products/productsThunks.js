import { createAsyncThunk } from '@reduxjs/toolkit';
import { productsApi } from '../../services/productsService';

const LIST_STALE_MS = 60000;
const DETAILS_STALE_MS = 300000;

export const makeKey = (arg = {}) => {
  const { force, ...params } = arg;
  return JSON.stringify(params);
};

export const fetchProducts = createAsyncThunk(
  'products/fetchList',
  (params, { signal }) => productsApi.list({ ...params, signal }),
  {
    condition: (params, { getState }) => {
      const { list } = getState().products;
      if (list.key !== makeKey(params)) return true;
      if (list.status === 'loading') return false;
      if (params.force) return true;
      return !(list.status === 'succeeded' && Date.now() - list.fetchedAt < LIST_STALE_MS);
    },
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchDetails',
  async ({ id }, { signal }) => {
    const { fromCache, ...product } = await productsApi.get(id, signal);
    return { product, fromCache };
  },
  {
    condition: ({ id, force }, { getState }) => {
      const { entities, details } = getState().products;
      if (entities[id]?.local) return false;
      if (details.status === 'loading' && details.currentId === String(id)) return false;
      if (force) return true;
      const fetchedAt = details.fetchedAt[id];
      return !(fetchedAt && Date.now() - fetchedAt < DETAILS_STALE_MS);
    },
  }
);

export const createProduct = createAsyncThunk('products/create', async (data) => {
  const response = await productsApi.create(data);
  return { ...data, ...response, id: `new-${Date.now()}`, local: true };
});

export const updateProduct = createAsyncThunk('products/update', async ({ id, data }, { getState }) => {
  if (getState().products.entities[id]?.local) return { id, changes: data };
  const { id: ignored, ...response } = await productsApi.update(id, data);
  return { id, changes: { ...data, ...response } };
});

export const deleteProduct = createAsyncThunk('products/delete', async (id, { getState }) => {
  if (!getState().products.entities[id]?.local) await productsApi.remove(id);
  return id;
});
