import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '../services/catalogApi';
import type { ProductListParams } from '../types/catalog.types';

export function useProducts(params: ProductListParams = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => catalogApi.getProducts(params),
    staleTime: 1000 * 60 * 2,
  });
}

export function useSearchProducts(params: ProductListParams = {}) {
  return useQuery({
    queryKey: ['products', 'search', params],
    queryFn: () => catalogApi.searchProducts(params),
    enabled: Boolean(params.search?.trim()),
    staleTime: 1000 * 60,
  });
}

export function useProductDetails(slug: string) {
  return useQuery({
    queryKey: ['products', slug],
    queryFn: () => catalogApi.getProductBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: catalogApi.getCategories,
    staleTime: 1000 * 60 * 10,
  });
}

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: catalogApi.getBrands,
    staleTime: 1000 * 60 * 10,
  });
}
