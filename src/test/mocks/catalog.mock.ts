export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  discountPrice?: number | null;
  imageUrl?: string | null;
  images?: ProductImage[];
  brand?: Brand | null;
  category?: Category | null;
  variants?: ProductVariant[];
  availability: 'IN_STOCK' | 'OUT_OF_STOCK' | 'LOW_STOCK';
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price?: number | null;
  stockQuantity: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string | null;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
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
}

export const mockBrand: Brand = {
  id: 'brand-1',
  name: 'TechPro',
  slug: 'techpro',
  logoUrl: '/images/brands/techpro.png',
};

export const mockBrand2: Brand = {
  id: 'brand-2',
  name: 'StyleCraft',
  slug: 'stylecraft',
  logoUrl: null,
};

export const mockCategory: Category = {
  id: 'cat-1',
  name: 'Electronics',
  slug: 'electronics',
  description: 'Electronic devices and accessories',
  imageUrl: '/images/categories/electronics.jpg',
};

export const mockCategory2: Category = {
  id: 'cat-2',
  name: 'Clothing',
  slug: 'clothing',
  description: 'Fashion and apparel',
  imageUrl: null,
};

export const mockSubCategory: Category = {
  id: 'cat-3',
  name: 'Laptops',
  slug: 'laptops',
  description: 'Portable computers',
  imageUrl: '/images/categories/laptops.jpg',
};

export const mockVariants: ProductVariant[] = [
  {
    id: 'var-1',
    name: '256GB',
    sku: 'TP-LAP-256',
    price: 1099.99,
    stockQuantity: 15,
  },
  {
    id: 'var-2',
    name: '512GB',
    sku: 'TP-LAP-512',
    price: 1299.99,
    stockQuantity: 10,
  },
  {
    id: 'var-3',
    name: '1TB',
    sku: 'TP-LAP-1TB',
    price: 1499.99,
    stockQuantity: 0,
  },
];

export const mockImages: ProductImage[] = [
  { id: 'img-1', url: '/images/products/laptop-1.jpg', altText: 'Laptop front view' },
  { id: 'img-2', url: '/images/products/laptop-2.jpg', altText: 'Laptop side view' },
];

export const mockProduct: Product = {
  id: 'prod-1',
  name: 'Pro Laptop 15"',
  slug: 'pro-laptop-15',
  description: 'A high-performance laptop for professionals.',
  price: 1299.99,
  discountPrice: 1099.99,
  imageUrl: '/images/products/laptop-1.jpg',
  images: mockImages,
  brand: mockBrand,
  category: mockCategory,
  variants: mockVariants,
  availability: 'IN_STOCK',
  status: 'ACTIVE',
};

export const mockProductNoDiscount: Product = {
  id: 'prod-2',
  name: 'Wireless Mouse',
  slug: 'wireless-mouse',
  description: 'Ergonomic wireless mouse.',
  price: 49.99,
  discountPrice: null,
  imageUrl: null,
  images: [],
  brand: mockBrand,
  category: mockCategory,
  variants: [],
  availability: 'LOW_STOCK',
  status: 'ACTIVE',
};

export const mockProductOutOfStock: Product = {
  id: 'prod-3',
  name: 'Mechanical Keyboard',
  slug: 'mechanical-keyboard',
  description: 'RGB mechanical keyboard.',
  price: 89.99,
  discountPrice: 79.99,
  imageUrl: '/images/products/keyboard.jpg',
  images: [],
  brand: mockBrand2,
  category: mockCategory,
  variants: [],
  availability: 'OUT_OF_STOCK',
  status: 'ACTIVE',
};

export const mockProductInactive: Product = {
  id: 'prod-4',
  name: 'Old Phone',
  slug: 'old-phone',
  description: 'Discontinued phone model.',
  price: 299.99,
  discountPrice: null,
  imageUrl: null,
  images: [],
  brand: mockBrand,
  category: mockCategory,
  variants: [],
  availability: 'OUT_OF_STOCK',
  status: 'INACTIVE',
};

export const mockProductNoBrand: Product = {
  id: 'prod-5',
  name: 'Generic USB Cable',
  slug: 'generic-usb-cable',
  price: 9.99,
  discountPrice: null,
  imageUrl: null,
  images: [],
  brand: null,
  category: null,
  variants: [],
  availability: 'IN_STOCK',
  status: 'ACTIVE',
};

export const mockProducts: Product[] = [
  mockProduct,
  mockProductNoDiscount,
  mockProductOutOfStock,
  mockProductNoBrand,
];

export const mockCategories: Category[] = [
  mockCategory,
  mockCategory2,
  mockSubCategory,
];

export const mockBrands: Brand[] = [
  mockBrand,
  mockBrand2,
];

export const mockPaginatedResponse = {
  results: mockProducts,
  count: 4,
  page: 1,
  totalPages: 1,
  next: null,
  previous: null,
};

export const mockEmptyPaginatedResponse = {
  results: [],
  count: 0,
  page: 1,
  totalPages: 0,
  next: null,
  previous: null,
};

export const singleVariantProduct: Product = {
  ...mockProduct,
  variants: [
    {
      id: 'var-single',
      name: 'Default',
      sku: 'TP-LAP-DEF',
      price: null,
      stockQuantity: 20,
    },
  ],
};

export const allOutOfStockVariants: Product = {
  ...mockProduct,
  variants: [
    { id: 'var-oos-1', name: '8GB', sku: 'OOS-8GB', price: 999.99, stockQuantity: 0 },
    { id: 'var-oos-2', name: '16GB', sku: 'OOS-16GB', price: 1199.99, stockQuantity: 0 },
  ],
  availability: 'OUT_OF_STOCK',
};
