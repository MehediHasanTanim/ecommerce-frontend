import { http, HttpResponse } from 'msw';
import { mockWishlistItems, mockEmptyWishlist, mockWishlistItem1 } from '@/test/mocks/wishlist.mock';
import { WishlistItem } from '@/types/wishlist';

const API_BASE = 'http://localhost:8015/api/v1';

export const wishlistHandlers = [
  /** GET /api/v1/wishlist/ — List Wishlist */
  http.get(`${API_BASE}/wishlist/`, () => {
    return HttpResponse.json<WishlistItem[]>(mockWishlistItems);
  }),

  /** POST /api/v1/wishlist/add/ — Add to Wishlist */
  http.post(`${API_BASE}/wishlist/add/`, async ({ request }) => {
    const body = await request.json() as { product_id: number };
    const newItem: WishlistItem = {
      ...mockWishlistItem1,
      id: `wish-uuid-new-${body.product_id}`,
      product_id: body.product_id,
      created_at: new Date().toISOString(),
    };
    return HttpResponse.json<WishlistItem>(newItem, { status: 201 });
  }),

  /** DELETE /api/v1/wishlist/:product_id/ — Remove from Wishlist */
  http.delete(`${API_BASE}/wishlist/:product_id/`, () => {
    return HttpResponse.json(null, { status: 204 });
  }),
];

/** Handlers that return an empty wishlist */
export const emptyWishlistHandlers = [
  http.get(`${API_BASE}/wishlist/`, () => {
    return HttpResponse.json<WishlistItem[]>(mockEmptyWishlist);
  }),
];

/** Handlers that simulate a wishlist fetch error */
export const errorWishlistHandlers = [
  http.get(`${API_BASE}/wishlist/`, () => {
    return HttpResponse.json(
      { detail: 'Failed to load wishlist' },
      { status: 500 }
    );
  }),
];
