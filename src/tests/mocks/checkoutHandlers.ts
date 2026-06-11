import { http, HttpResponse } from 'msw';
import {
  mockCheckoutSummary,
  mockCheckoutSummaryEmpty,
  mockPlaceOrderResponse,
} from '@/test/mocks/checkout.mock';
import type { CheckoutSummary, PlaceOrderResponse } from '@/types/order';

const API_BASE = 'http://localhost:8015/api/v1';

export const checkoutHandlers = [
  /** GET /api/v1/checkout/summary/ — Fetch checkout summary */
  http.get(`${API_BASE}/checkout/summary/`, () => {
    return HttpResponse.json<CheckoutSummary>(mockCheckoutSummary);
  }),

  /** POST /api/v1/checkout/place-order/ — Place an order */
  http.post(`${API_BASE}/checkout/place-order/`, async ({ request }) => {
    const body = await request.json() as { address_id: string; payment_method: string };
    // Validate required fields
    if (!body.address_id || !body.payment_method) {
      return HttpResponse.json(
        { detail: 'Address and payment method are required' },
        { status: 400 }
      );
    }
    return HttpResponse.json<PlaceOrderResponse>(mockPlaceOrderResponse, {
      status: 201,
    });
  }),
];

/** Handlers that return an empty checkout summary */
export const emptyCheckoutHandlers = [
  http.get(`${API_BASE}/checkout/summary/`, () => {
    return HttpResponse.json<CheckoutSummary>(mockCheckoutSummaryEmpty);
  }),
];

/** Handlers that simulate a checkout summary fetch error */
export const errorCheckoutHandlers = [
  http.get(`${API_BASE}/checkout/summary/`, () => {
    return HttpResponse.json(
      { detail: 'Failed to load checkout summary' },
      { status: 500 }
    );
  }),
];

/** Handlers that simulate a place-order error */
export const placeOrderErrorHandlers = [
  http.get(`${API_BASE}/checkout/summary/`, () => {
    return HttpResponse.json<CheckoutSummary>(mockCheckoutSummary);
  }),
  http.post(`${API_BASE}/checkout/place-order/`, () => {
    return HttpResponse.json(
      { detail: 'Insufficient stock for some items' },
      { status: 400 }
    );
  }),
];
