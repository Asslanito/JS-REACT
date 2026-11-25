import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createProduct,
  deleteProduct,
  fetchProductById,
  fetchProducts,
  updateProduct,
} from '../features/products/productsThunks';
import {
  selectDetailsMeta,
  selectListMeta,
  selectMutation,
  selectProductById,
  selectProductsForView,
  selectTotalPages,
} from '../features/products/productsSelectors';
import {
  fetchCategories,
  selectCategoriesMeta,
  selectCategoryOptions,
} from '../features/categories/categoriesSlice';

export function useProductsList(params, onlyFavorites = false) {
  const dispatch = useDispatch();
  const { q, category, page, sortBy, order } = params;

  useEffect(() => {
    dispatch(fetchProducts({ q, category, page, sortBy, order }));
  }, [dispatch, q, category, page, sortBy, order]);

  const list = useSelector(selectListMeta);
  const products = useSelector((state) => selectProductsForView(state, onlyFavorites));
  const totalPages = useSelector(selectTotalPages);

  const retry = useCallback(
    () => dispatch(fetchProducts({ q, category, page, sortBy, order, force: true })),
    [dispatch, q, category, page, sortBy, order]
  );

  return {
    products,
    totalPages,
    total: list.total,
    error: list.error,
    fromCache: list.fromCache,
    isPending: !list.fetchedAt && list.status !== 'failed',
    isFetching: list.status === 'loading',
    isError: list.status === 'failed',
    retry,
  };
}

export function useCategories() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  const meta = useSelector(selectCategoriesMeta);
  const items = useSelector(selectCategoryOptions);
  return {
    items,
    isError: meta.status === 'failed',
    retry: () => dispatch(fetchCategories({ force: true })),
  };
}

export function useProduct(id) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProductById({ id }));
  }, [dispatch, id]);
  const product = useSelector((state) => selectProductById(state, id));
  const details = useSelector(selectDetailsMeta);
  return {
    product,
    fromCache: details.fromCache,
    error: details.error,
    isPending: !product && details.status !== 'failed',
    isError: !product && details.status === 'failed',
    retry: () => dispatch(fetchProductById({ id, force: true })),
  };
}

export function useProductActions() {
  const dispatch = useDispatch();
  const mutation = useSelector(selectMutation);
  return {
    mutation,
    isPending: mutation.status === 'loading',
    create: (data) => dispatch(createProduct(data)).unwrap(),
    update: (id, data) => dispatch(updateProduct({ id, data })).unwrap(),
    remove: (id) => dispatch(deleteProduct(id)).unwrap(),
  };
}
