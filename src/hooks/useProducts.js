import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productKeys, productsApi } from '../services/productsService';

// Cache strategy: data is fresh for 60s (no refetch), kept in memory for 5 min,
// and revalidated on window focus once stale. See README.
export function useProductsList(params) {
  return useQuery({
    queryKey: productKeys.list(params),
    // `signal` aborts the previous request when the key changes, so an old
    // response can never overwrite a newer one.
    queryFn: ({ signal }) => productsApi.list({ ...params, signal }),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    placeholderData: keepPreviousData,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: productKeys.categories,
    queryFn: ({ signal }) => productsApi.categories(signal),
    staleTime: 60 * 60_000,
  });
}

function useInvalidatingMutation(mutationFn) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.all }),
  });
}

export const useCreateProduct = () => useInvalidatingMutation((data) => productsApi.create(data));
export const useUpdateProduct = () => useInvalidatingMutation(({ id, data }) => productsApi.update(id, data));
export const useDeleteProduct = () => useInvalidatingMutation((id) => productsApi.remove(id));
