import { ProductListParams } from '../types/catalog.types';

export function getCatalogParams(searchParams: URLSearchParams): ProductListParams {
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  return {
    page: Number(searchParams.get('page') || 1),
    limit: Number(searchParams.get('limit') || 12),
    search: searchParams.get('q') || undefined,
    category: searchParams.get('category') || undefined,
    brand: searchParams.get('brand') || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    availability: searchParams.get('availability') || undefined,
    sort: searchParams.get('sort') || 'newest',
  };
}

export function buildPathWithParams(pathname: string, params: URLSearchParams) {
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
