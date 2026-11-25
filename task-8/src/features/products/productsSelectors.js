import { createSelector } from '@reduxjs/toolkit';
import { PAGE_SIZE } from '../../services/productsService';
import { productsAdapter } from './productsSlice';

const adapterSelectors = productsAdapter.getSelectors((state) => state.products);

export const selectProductEntities = adapterSelectors.selectEntities;
export const selectProductById = adapterSelectors.selectById;

export const selectListMeta = (state) => state.products.list;
export const selectDetailsMeta = (state) => state.products.details;
export const selectMutation = (state) => state.products.mutation;
export const selectFavoriteIds = (state) => state.favorites.ids;

export const selectVisibleProducts = createSelector(
  [(state) => state.products.list.ids, selectProductEntities],
  (ids, entities) => ids.map((id) => entities[id]).filter(Boolean)
);

export const selectTotalPages = createSelector(
  [(state) => state.products.list.total],
  (total) => Math.max(1, Math.ceil(total / PAGE_SIZE))
);

export const selectFavoriteSet = createSelector([selectFavoriteIds], (ids) => new Set(ids));

export const selectProductsForView = createSelector(
  [selectVisibleProducts, selectFavoriteSet, (state, onlyFavorites) => onlyFavorites],
  (products, favoriteSet, onlyFavorites) =>
    onlyFavorites ? products.filter((product) => favoriteSet.has(product.id)) : products
);
