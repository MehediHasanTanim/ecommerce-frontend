import { Cart, CartItem } from '@/types/cart';

export const mockCartItemA: CartItem = {
  id: 'item-uuid-1',
  product_id: 101,
  product_name: 'Product A',
  product_slug: 'product-a',
  variant_id: 201,
  variant_name: 'Red / Large',
  sku: 'SKU-A-RED-L',
  attributes: { color: 'Red', size: 'Large' },
  quantity: 2,
  unit_price: '100.00',
  line_total: '200.00',
  stock_quantity: 10,
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T10:00:00Z',
};

export const mockCartItemB: CartItem = {
  id: 'item-uuid-2',
  product_id: 102,
  product_name: 'Product B',
  product_slug: 'product-b',
  variant_id: 202,
  variant_name: 'Blue / Medium',
  sku: 'SKU-B-BLUE-M',
  attributes: { color: 'Blue', size: 'Medium' },
  quantity: 1,
  unit_price: '50.00',
  line_total: '50.00',
  stock_quantity: 5,
  created_at: '2024-01-15T10:05:00Z',
  updated_at: '2024-01-15T10:05:00Z',
};

export const mockCartItemC: CartItem = {
  id: 'item-uuid-3',
  product_id: 103,
  product_name: 'Product C',
  product_slug: 'product-c',
  variant_id: 203,
  variant_name: null,
  sku: 'SKU-C-DEFAULT',
  attributes: null,
  quantity: 5,
  unit_price: '20.00',
  line_total: '100.00',
  stock_quantity: 5,
  created_at: '2024-01-15T11:00:00Z',
  updated_at: '2024-01-15T11:00:00Z',
};

export const mockEmptyCart: Cart = {
  id: 'cart-uuid-empty',
  user: null,
  guest_token: 'guest-token-123',
  items: [],
  subtotal: 0,
  discount: 0,
  grand_total: 0,
  item_count: 0,
  coupon: null,
  coupon_code: null,
  created_at: '2024-01-15T09:00:00Z',
  updated_at: '2024-01-15T09:00:00Z',
};

export const mockCartWithItems: Cart = {
  id: 'cart-uuid-1',
  user: 'user-uuid-1',
  guest_token: null,
  items: [mockCartItemA, mockCartItemB],
  subtotal: 250,
  discount: 20,
  grand_total: 230,
  item_count: 3,
  coupon: 1,
  coupon_code: 'SAVE20',
  created_at: '2024-01-15T09:00:00Z',
  updated_at: '2024-01-15T10:05:00Z',
};

export const mockCartWithMaxStockItem: Cart = {
  id: 'cart-uuid-max',
  user: 'user-uuid-1',
  guest_token: null,
  items: [mockCartItemC],
  subtotal: 100,
  discount: 0,
  grand_total: 100,
  item_count: 5,
  coupon: null,
  coupon_code: null,
  created_at: '2024-01-15T09:00:00Z',
  updated_at: '2024-01-15T11:00:00Z',
};

export const mockCartSingleItem: Cart = {
  id: 'cart-uuid-single',
  user: 'user-uuid-1',
  guest_token: null,
  items: [{ ...mockCartItemA, quantity: 1, line_total: '100.00' }],
  subtotal: 100,
  discount: 0,
  grand_total: 100,
  item_count: 1,
  coupon: null,
  coupon_code: null,
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T10:00:00Z',
};
