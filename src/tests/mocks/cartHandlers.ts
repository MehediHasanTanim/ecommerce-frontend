import { http, HttpResponse } from 'msw';
import { mockCartWithItems, mockEmptyCart, mockCartSingleItem } from '@/test/mocks/cart.mock';
import { Cart } from '@/types/cart';

const API_BASE = 'http://localhost:8015/api/v1';

export const cartHandlers = [
  /** GET /api/v1/cart/ — View Cart */
  http.get(`${API_BASE}/cart/`, () => {
    return HttpResponse.json<Cart>(mockCartWithItems);
  }),

  /** POST /api/v1/cart/add/ — Add Item to Cart */
  http.post(`${API_BASE}/cart/add/`, async ({ request }) => {
    const body = await request.json() as { variant_id: number; quantity?: number };
    const qty = body.quantity ?? 1;
    const updatedCart: Cart = {
      ...mockCartWithItems,
      item_count: mockCartWithItems.item_count + qty,
    };
    return HttpResponse.json<Cart>(updatedCart, { status: 201 });
  }),

  /** PUT /api/v1/cart/items/:item_id/ — Update Quantity */
  http.put(`${API_BASE}/cart/items/:item_id/`, async ({ params, request }) => {
    const { item_id } = params;
    const body = await request.json() as { quantity: number };
    const updatedItems = mockCartWithItems.items.map((item) =>
      item.id === item_id
        ? {
            ...item,
            quantity: body.quantity,
            line_total: (parseFloat(item.unit_price) * body.quantity).toFixed(2),
          }
        : item
    );
    const subtotal = updatedItems.reduce((sum, i) => sum + parseFloat(i.line_total), 0);
    return HttpResponse.json<Cart>({
      ...mockCartWithItems,
      items: updatedItems,
      subtotal,
      grand_total: Math.max(0, subtotal - mockCartWithItems.discount),
      item_count: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
    });
  }),

  /** DELETE /api/v1/cart/items/:item_id/delete/ — Remove Item */
  http.delete(`${API_BASE}/cart/items/:item_id/delete/`, ({ params }) => {
    const { item_id } = params;
    const updatedItems = mockCartWithItems.items.filter((i) => i.id !== item_id);
    const subtotal = updatedItems.reduce((sum, i) => sum + parseFloat(i.line_total), 0);
    return HttpResponse.json<Cart>({
      ...mockCartWithItems,
      items: updatedItems,
      subtotal,
      grand_total: Math.max(0, subtotal - mockCartWithItems.discount),
      item_count: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
    });
  }),

  /** POST /api/v1/cart/coupons/apply/ — Apply Coupon */
  http.post(`${API_BASE}/cart/coupons/apply/`, async () => {
    return HttpResponse.json<Cart>({
      ...mockCartWithItems,
      discount: 20,
      grand_total: mockCartWithItems.subtotal - 20,
      coupon: 1,
      coupon_code: 'SAVE20',
    });
  }),

  /** DELETE /api/v1/cart/coupons/remove/ — Remove Coupon */
  http.delete(`${API_BASE}/cart/coupons/remove/`, () => {
    return HttpResponse.json<Cart>({
      ...mockCartWithItems,
      discount: 0,
      grand_total: mockCartWithItems.subtotal,
      coupon: null,
      coupon_code: null,
    });
  }),
];

/** Handlers that return an empty cart */
export const emptyCartHandlers = [
  http.get(`${API_BASE}/cart/`, () => {
    return HttpResponse.json<Cart>(mockEmptyCart);
  }),
];

/** Handlers that return a single-item cart */
export const singleItemCartHandlers = [
  http.get(`${API_BASE}/cart/`, () => {
    return HttpResponse.json<Cart>(mockCartSingleItem);
  }),
];

/** Handlers that simulate a cart fetch error */
export const errorCartHandlers = [
  http.get(`${API_BASE}/cart/`, () => {
    return HttpResponse.json(
      { detail: 'Failed to load cart' },
      { status: 500 }
    );
  }),
];
