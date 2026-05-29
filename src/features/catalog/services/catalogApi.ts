import { axiosInstance } from '@/lib/axios';
import {
  BackendBrand,
  BackendCategory,
  BackendProductDetail,
  BackendProductList,
  Brand,
  Category,
  PaginatedResponse,
  Product,
  ProductImage,
  ProductListParams,
  ProductVariant,
} from '../types/catalog.types';

type BackendPaginated<T> = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
};

function toNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === '') return 0;
  return Number(value);
}

function normalizeAvailability(stockStatus?: string) {
  const normalized = (stockStatus || '').toLowerCase();
  if (normalized.includes('out')) return 'OUT_OF_STOCK' as const;
  if (normalized.includes('low')) return 'LOW_STOCK' as const;
  return 'IN_STOCK' as const;
}

function normalizeBrand(brand?: BackendBrand | null): Brand | null {
  if (!brand) return null;
  return {
    id: String(brand.id),
    name: brand.name,
    slug: brand.slug,
    logoUrl: (brand as any).logoUrl ?? brand.logo ?? null,
    description: brand.description,
  };
}

function normalizeCategory(category?: BackendCategory | null): Category | null {
  if (!category) return null;
  return {
    id: String(category.id),
    name: category.name,
    slug: category.slug,
    description: category.description,
    imageUrl: (category as any).imageUrl ?? category.image ?? null,
  };
}

function parseArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  return [];
}

function normalizeImages(value: unknown): ProductImage[] {
  return parseArray<any>(value).map((image) => ({
    id: String(image.id),
    url: image.image_url || image.url || '',
    altText: image.alt_text || image.altText || '',
    isPrimary: Boolean(image.is_primary || image.isPrimary),
  })).filter((image) => image.url);
}

function normalizeVariants(value: unknown): ProductVariant[] {
  return parseArray<any>(value).map((variant) => ({
    id: String(variant.id ?? variant.sku),
    name: variant.variant_name || variant.name || variant.sku,
    sku: variant.sku,
    price: variant.price ? toNumber(variant.price) : null,
    salePrice: variant.sale_price ? toNumber(variant.sale_price) : null,
    stockQuantity: Number(variant.stock_quantity ?? variant.stockQuantity ?? 0),
    attributes: variant.attributes || undefined,
  }));
}

function normalizeProductListItem(product: BackendProductList): Product {
  const productAny = product as any;
  return {
    id: String(product.id),
    name: product.name,
    slug: product.slug,
    description: productAny.description,
    price: toNumber(productAny.price),
    discountPrice: productAny.discountPrice ?? (product.sale_price ? toNumber(product.sale_price) : null),
    imageUrl: productAny.imageUrl ?? product.primary_image ?? null,
    brand: typeof product.brand === 'object' ? normalizeBrand(product.brand as BackendBrand) : product.brand ? { id: product.brand_slug || product.brand, name: product.brand, slug: product.brand_slug || '' } : null,
    category: typeof product.category === 'object' ? normalizeCategory(product.category as BackendCategory) : product.category ? { id: product.category_slug || product.category, name: product.category, slug: product.category_slug || '' } : null,
    availability: productAny.availability ?? normalizeAvailability(product.stock_status),
    status: productAny.status ?? 'ACTIVE',
    isFeatured: Boolean(productAny.isFeatured ?? product.is_featured),
    variants: normalizeVariants(productAny.variants),
    images: normalizeImages(productAny.images),
  };
}

function normalizeProductDetail(product: BackendProductDetail): Product {
  const productAny = product as any;
  const images = normalizeImages(product.images).length ? normalizeImages(product.images) : normalizeImages(productAny.images);
  return {
    id: String(product.id),
    name: product.name,
    slug: product.slug,
    description: product.description,
    shortDescription: product.short_description ?? productAny.shortDescription,
    price: toNumber(product.base_price ?? productAny.price),
    discountPrice: productAny.discountPrice ?? (product.sale_price ? toNumber(product.sale_price) : null),
    imageUrl: productAny.imageUrl ?? images[0]?.url ?? null,
    images,
    brand: normalizeBrand(product.brand),
    category: normalizeCategory(product.category),
    variants: normalizeVariants(product.variants),
    relatedProducts: parseArray<BackendProductList>(product.related_products ?? productAny.relatedProducts).map(normalizeProductListItem),
    availability: productAny.availability ?? normalizeAvailability(product.stock_status),
    status: productAny.status ?? (product.is_active === false ? 'INACTIVE' : 'ACTIVE'),
    isFeatured: Boolean(productAny.isFeatured ?? product.is_featured),
    metaTitle: product.meta_title,
    metaDescription: product.meta_description,
  };
}

function toBackendParams(params?: ProductListParams) {
  const query: Record<string, string | number | boolean> = {};
  if (!params) return query;
  if (params.page) query.page = params.page;
  if (params.limit) query.page_size = params.limit;
  if (params.limit) query.limit = params.limit;
  if (params.category) query.category = params.category;
  if (params.brand) query.brand = params.brand;
  if (params.minPrice !== undefined) query.price_min = params.minPrice;
  if (params.minPrice !== undefined) query.minPrice = params.minPrice;
  if (params.maxPrice !== undefined) query.price_max = params.maxPrice;
  if (params.maxPrice !== undefined) query.maxPrice = params.maxPrice;
  if (params.sort) query.sort = params.sort;
  if (params.search) query.q = params.search;
  if (params.isFeatured !== undefined) query.is_featured = params.isFeatured;
  if (params.availability) query.in_stock = params.availability.toUpperCase() === 'IN_STOCK' || params.availability.toLowerCase() === 'in_stock';
  if (params.availability) query.availability = params.availability;
  return query;
}

function getResults<T>(data: BackendPaginated<T> | T[]): T[] {
  return Array.isArray(data) ? data : data.results;
}

function getCount<T>(data: BackendPaginated<T> | T[]) {
  return Array.isArray(data) ? data.length : data.count;
}

function normalizePaginated<T>(response: BackendPaginated<T> | T[], params?: ProductListParams, mapper?: (value: T) => Product): PaginatedResponse<Product> {
  const page = params?.page || 1;
  const limit = params?.limit || 12;
  const count = getCount(response);
  return {
    results: mapper ? getResults(response).map(mapper) : (getResults(response) as unknown as Product[]),
    count,
    page,
    totalPages: Math.ceil(count / limit),
    next: Array.isArray(response) ? null : response.next ?? null,
    previous: Array.isArray(response) ? null : response.previous ?? null,
  };
}

export const catalogApi = {
  async getProducts(params?: ProductListParams): Promise<PaginatedResponse<Product>> {
    const response = await axiosInstance.get<BackendPaginated<BackendProductList>>('products/', {
      params: toBackendParams(params),
    });
    return normalizePaginated(response.data, params, normalizeProductListItem);
  },

  async searchProducts(params?: ProductListParams): Promise<PaginatedResponse<Product>> {
    const response = await axiosInstance.get<BackendPaginated<BackendProductList>>('products/', {
      params: toBackendParams(params),
    });
    return normalizePaginated(response.data, params, normalizeProductListItem);
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const response = await axiosInstance.get<BackendProductDetail>(`products/${slug}/`);
    return normalizeProductDetail(response.data);
  },

  async getCategories(): Promise<Category[]> {
    const response = await axiosInstance.get<BackendCategory[] | BackendPaginated<BackendCategory>>('categories/');
    return getResults(response.data).map(normalizeCategory).filter(Boolean) as Category[];
  },

  async getCategoryBySlug(slug: string): Promise<Category> {
    const response = await axiosInstance.get<BackendCategory>(`categories/${slug}/`);
    return normalizeCategory(response.data) as Category;
  },

  async getBrands(): Promise<Brand[]> {
    const response = await axiosInstance.get<BackendBrand[] | BackendPaginated<BackendBrand>>('brands/');
    return getResults(response.data).map(normalizeBrand).filter(Boolean) as Brand[];
  },
};
