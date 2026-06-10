import { WishlistItem } from '@/types/wishlist';

export const mockWishlistItem1: WishlistItem = {
  id: 'wish-uuid-1',
  product_id: 101,
  product_name: 'Product A',
  product_slug: 'product-a',
  image_url: 'https://example.com/images/product-a.jpg',
  price: '99.99',
  in_stock: true,
  created_at: '2024-01-10T08:00:00Z',
};

export const mockWishlistItem2: WishlistItem = {
  id: 'wish-uuid-2',
  product_id: 102,
  product_name: 'Product B',
  product_slug: 'product-b',
  image_url: null,
  price: '49.99',
  in_stock: true,
  created_at: '2024-01-12T14:00:00Z',
};

export const mockWishlistItemOutOfStock: WishlistItem = {
  id: 'wish-uuid-3',
  product_id: 103,
  product_name: 'Out of Stock Product',
  product_slug: 'out-of-stock-product',
  image_url: null,
  price: '29.99',
  in_stock: false,
  created_at: '2024-01-05T10:00:00Z',
};

export const mockWishlistItems: WishlistItem[] = [
  mockWishlistItem1,
  mockWishlistItem2,
];

export const mockEmptyWishlist: WishlistItem[] = [];
