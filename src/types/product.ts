export interface ProductImage {
  id: string;
  image: string;
  alt_text?: string;
  is_primary: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  attributes?: Record<string, string>;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number;
  stock: number;
  is_active: boolean;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  brand?: {
    id: string;
    name: string;
    slug: string;
  };
  images: ProductImage[];
  variants?: ProductVariant[];
  created_at: string;
  updated_at: string;
}

export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price?: number;
  stock: number;
  image?: string;
  category?: string;
  brand?: string;
}
