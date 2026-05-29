import { useQuery } from '@tanstack/react-query';
import type { ProductListParams } from '@/test/mocks/catalog.mock';

export function useProducts(params: ProductListParams = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => ({ results: [], count: 0, page: 1, totalPages: 0 }),
    staleTime: 1000 * 60 * 2,
  });
}

export function useSearchProducts(params: ProductListParams = {}) {
  return useQuery({
    queryKey: ['products', 'search', params],
    queryFn: async () => ({ results: [], count: 0, page: 1, totalPages: 0 }),
    enabled: Boolean(params.search?.trim()),
    staleTime: 1000 * 60,
  });
}

export function useProductDetails(slug: string) {
  return useQuery({
    queryKey: ['products', slug],
    queryFn: async () => null,
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  });
}
