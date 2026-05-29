export type CatalogAvailability = 'IN_STOCK' | 'OUT_OF_STOCK' | 'LOW_STOCK';
export type CatalogStatus = 'ACTIVE' | 'INACTIVE' | 'DRAFT';

export interface CatalogBrand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
}

export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string | null;
}

export interface CatalogVariant {
  id: string;
  name: string;
  sku: string;
  price?: number | null;
  stockQuantity: number;
}

export interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  imageUrl?: string | null;
  brand?: CatalogBrand | null;
  category?: CatalogCategory | null;
  variants?: CatalogVariant[];
  availability: CatalogAvailability;
  status: CatalogStatus;
  createdAt: string;
}

export const electronicsCategory: CatalogCategory = {
  id: 'cat-electronics',
  name: 'Electronics',
  slug: 'electronics',
  description: 'Devices, gadgets, and accessories.',
  imageUrl: '/images/categories/electronics.jpg',
};

export const clothingCategory: CatalogCategory = {
  id: 'cat-clothing',
  name: 'Clothing',
  slug: 'clothing',
  description: 'Everyday fashion and apparel.',
  imageUrl: '/images/categories/clothing.jpg',
};

export const emptyCategory: CatalogCategory = {
  id: 'cat-empty',
  name: 'Empty Category',
  slug: 'empty-category',
  description: 'A category with no active products.',
  imageUrl: null,
};

export const techProBrand: CatalogBrand = {
  id: 'brand-techpro',
  name: 'TechPro',
  slug: 'techpro',
  logoUrl: '/images/brands/techpro.png',
};

export const styleCraftBrand: CatalogBrand = {
  id: 'brand-stylecraft',
  name: 'StyleCraft',
  slug: 'stylecraft',
  logoUrl: '/images/brands/stylecraft.png',
};

export const catalogProducts: CatalogProduct[] = [
  {
    id: 'prod-laptop',
    name: 'Pro Laptop 15',
    slug: 'pro-laptop-15',
    description: 'A high-performance laptop for professionals.',
    price: 1299,
    discountPrice: 1099,
    imageUrl: '/images/products/laptop.jpg',
    brand: techProBrand,
    category: electronicsCategory,
    availability: 'IN_STOCK',
    status: 'ACTIVE',
    createdAt: '2026-01-05T00:00:00Z',
    variants: [
      { id: 'var-256', name: '256GB', sku: 'LAP-256', price: 1099, stockQuantity: 12 },
      { id: 'var-512', name: '512GB', sku: 'LAP-512', price: 1299, stockQuantity: 8 },
    ],
  },
  {
    id: 'prod-mouse',
    name: 'Wireless Mouse',
    slug: 'wireless-mouse',
    description: 'A compact ergonomic mouse.',
    price: 49,
    discountPrice: null,
    imageUrl: '/images/products/mouse.jpg',
    brand: techProBrand,
    category: electronicsCategory,
    availability: 'LOW_STOCK',
    status: 'ACTIVE',
    createdAt: '2026-01-03T00:00:00Z',
    variants: [{ id: 'var-black', name: 'Black', sku: 'MOU-BLK', stockQuantity: 3 }],
  },
  {
    id: 'prod-shirt',
    name: 'Cotton Shirt',
    slug: 'cotton-shirt',
    description: 'A breathable cotton shirt.',
    price: 29,
    discountPrice: 24,
    imageUrl: '/images/products/shirt.jpg',
    brand: styleCraftBrand,
    category: clothingCategory,
    availability: 'IN_STOCK',
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00Z',
    variants: [
      { id: 'var-small', name: 'Small', sku: 'SHT-S', stockQuantity: 9 },
      { id: 'var-medium', name: 'Medium', sku: 'SHT-M', stockQuantity: 0 },
    ],
  },
  {
    id: 'prod-old-phone',
    name: 'Old Phone',
    slug: 'old-phone',
    description: 'Inactive product hidden from public catalog.',
    price: 199,
    discountPrice: null,
    imageUrl: '/images/products/old-phone.jpg',
    brand: techProBrand,
    category: electronicsCategory,
    availability: 'OUT_OF_STOCK',
    status: 'INACTIVE',
    createdAt: '2025-12-01T00:00:00Z',
    variants: [],
  },
];

export const activeCatalogProducts = catalogProducts.filter((product) => product.status === 'ACTIVE');
