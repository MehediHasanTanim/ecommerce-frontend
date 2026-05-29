export type ProductAvailability = 'IN_STOCK' | 'OUT_OF_STOCK' | 'LOW_STOCK';
export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'DRAFT';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string | null;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price?: number | null;
  salePrice?: number | null;
  stockQuantity: number;
  attributes?: Record<string, string>;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  discountPrice?: number | null;
  imageUrl?: string | null;
  images?: ProductImage[];
  brand?: Brand | null;
  category?: Category | null;
  variants?: ProductVariant[];
  relatedProducts?: Product[];
  availability: ProductAvailability;
  status: ProductStatus;
  isFeatured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  availability?: string;
  sort?: string;
  isFeatured?: boolean;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  page: number;
  totalPages: number;
  next?: string | null;
  previous?: string | null;
}

export interface BackendBrand {
  id: number;
  name: string;
  slug: string;
  logo?: string | null;
  description?: string;
  is_active?: boolean;
}

export interface BackendCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string | null;
  is_active?: boolean;
}

export interface BackendProductList {
  id: number;
  name: string;
  slug: string;
  category?: string;
  category_slug?: string;
  brand?: string;
  brand_slug?: string;
  price: string;
  sale_price?: string | null;
  primary_image?: string | null;
  stock_status?: string;
  is_featured?: boolean;
}

export interface BackendProductDetail {
  id: number;
  name: string;
  slug: string;
  sku?: string;
  category?: BackendCategory | null;
  brand?: BackendBrand | null;
  short_description?: string;
  description?: string;
  base_price: string;
  sale_price?: string | null;
  effective_price?: string;
  is_active?: boolean;
  is_featured?: boolean;
  meta_title?: string;
  meta_description?: string;
  stock_status?: string;
  variants?: unknown;
  images?: unknown;
  related_products?: unknown;
}
