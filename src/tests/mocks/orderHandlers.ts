import { http, HttpResponse } from 'msw';
import {
  mockOrdersList,
  mockOrder1,
  mockOrderPending,
  mockEmptyOrdersList,
} from '@/test/mocks/order.mock';
import type { Order, PaginatedOrders, CancelOrderResponse } from '@/types/order';

const API_BASE = 'http://localhost:8015/api/v1';

export const orderHandlers = [
  /** GET /api/v1/orders/ — List orders */
  http.get(`${API_BASE}/orders/`, ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const page = parseInt(url.searchParams.get('page') || '1', 10);

    if (status && status !== 'all') {
      const filtered = mockOrdersList.results.filter((o) => o.status === status);
      return HttpResponse.json<PaginatedOrders>({
        count: filtered.length,
        next: null,
        previous: null,
        results: filtered,
      });
    }

    return HttpResponse.json<PaginatedOrders>(mockOrdersList);
  }),

  /** GET /api/v1/orders/:id/ — Get order details */
  http.get(`${API_BASE}/orders/:id/`, ({ params }) => {
    const { id } = params;
    const allOrders = mockOrdersList.results;
    const order = allOrders.find((o) => o.id === id);
    if (!order) {
      return HttpResponse.json({ detail: 'Order not found' }, { status: 404 });
    }
    return HttpResponse.json<Order>(order);
  }),

  /** POST /api/v1/orders/:id/cancel/ — Cancel order */
  http.post(`${API_BASE}/orders/:id/cancel/`, ({ params }) => {
    const { id } = params;
    const allOrders = mockOrdersList.results;
    const order = allOrders.find((o) => o.id === id);
    if (!order) {
      return HttpResponse.json({ detail: 'Order not found' }, { status: 404 });
    }
    const response: CancelOrderResponse = {
      status: 'cancelled',
      message: 'Order cancelled successfully.',
    };
    return HttpResponse.json<CancelOrderResponse>(response);
  }),
];

/** Handlers that return empty orders */
export const emptyOrderHandlers = [
  http.get(`${API_BASE}/orders/`, () => {
    return HttpResponse.json<PaginatedOrders>(mockEmptyOrdersList);
  }),
  http.get(`${API_BASE}/orders/:id/`, () => {
    return HttpResponse.json({ detail: 'Order not found' }, { status: 404 });
  }),
];

/** Handlers that simulate orders fetch error */
export const errorOrderHandlers = [
  http.get(`${API_BASE}/orders/`, () => {
    return HttpResponse.json(
      { detail: 'Unable to load orders' },
      { status: 500 }
    );
  }),
];

/** Handlers for a single order (used in order success page) */
export const singleOrderHandlers = [
  http.get(`${API_BASE}/orders/:id/`, () => {
    return HttpResponse.json<Order>(mockOrder1);
  }),
];

/** Handlers for a pending order (cancel-able) */
export const pendingOrderHandlers = [
  http.get(`${API_BASE}/orders/:id/`, () => {
    return HttpResponse.json<Order>(mockOrderPending);
  }),
];
