import { Page } from '@playwright/test';
import { checkoutFixtures, ordersFixtures } from '../fixtures/checkout-orders';

/**
 * Mock all Checkout & Orders API endpoints for Playwright regression tests.
 */

export async function mockCheckoutAPIs(page: Page, options?: {
  emptyCart?: boolean;
  placeOrderError?: 'stock' | 'cart_empty' | 'invalid_address' | 'network';
  delay?: number;
}) {
  const summary = options?.emptyCart
    ? { items: [], subtotal: '0.00', discount: '0.00', shipping_fee: '0.00', tax: '0.00', grand_total: '0.00', item_count: 0 }
    : checkoutFixtures.summary;
  const delay = options?.delay ?? 0;

  // GET /api/v1/checkout/summary/
  await page.route('**/api/v1/checkout/summary/', async (route) => {
    if (delay) await new Promise((r) => setTimeout(r, delay));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(summary),
    });
  });

  // POST /api/v1/checkout/place-order/
  await page.route('**/api/v1/checkout/place-order/', async (route) => {
    if (delay) await new Promise((r) => setTimeout(r, delay));

    if (options?.placeOrderError === 'network') {
      await route.abort('failed');
      return;
    }

    if (options?.placeOrderError) {
      let errorBody;
      let status = 400;
      switch (options.placeOrderError) {
        case 'stock':
          errorBody = checkoutFixtures.placeOrderStockError;
          break;
        case 'cart_empty':
          errorBody = checkoutFixtures.placeOrderEmptyCartError;
          break;
        case 'invalid_address':
          errorBody = checkoutFixtures.placeOrderInvalidAddressError;
          break;
      }
      await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(errorBody) });
      return;
    }

    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify(checkoutFixtures.placeOrderSuccess),
    });
  });
}

export async function mockOrdersAPIs(page: Page, options?: {
  empty?: boolean;
  delay?: number;
  error?: boolean;
  orderDetailId?: string;
}) {
  const orders = options?.empty ? ordersFixtures.empty : ordersFixtures.list;
  const delay = options?.delay ?? 0;

  // GET /api/v1/orders/ — List orders
  await page.route('**/api/v1/orders/', async (route) => {
    if (delay) await new Promise((r) => setTimeout(r, delay));

    if (options?.error) {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ detail: 'Unable to load orders' }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(orders),
    });
  });

  // GET /api/v1/orders/:id/ — Order details
  await page.route(/\/api\/v1\/orders\/[^/]+\/$/, async (route) => {
    if (delay) await new Promise((r) => setTimeout(r, delay));

    const url = route.request().url();
    const detailId = options?.orderDetailId;

    // Return specific order detail based on ID or default
    const detail = ordersFixtures.detail;

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(detail),
    });
  });

  // POST /api/v1/orders/:id/cancel/
  await page.route(/\/api\/v1\/orders\/[^/]+\/cancel\/$/, async (route) => {
    if (delay) await new Promise((r) => setTimeout(r, delay));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'cancelled', message: 'Order cancelled successfully.' }),
    });
  });
}

/**
 * Mock all checkout + orders APIs in one call (convenience helper).
 */
export async function mockAllCheckoutOrderAPIs(page: Page, options?: {
  emptyCart?: boolean;
  emptyOrders?: boolean;
  placeOrderError?: 'stock' | 'cart_empty' | 'invalid_address' | 'network';
  ordersError?: boolean;
  delay?: number;
}) {
  await mockCheckoutAPIs(page, {
    emptyCart: options?.emptyCart,
    placeOrderError: options?.placeOrderError,
    delay: options?.delay,
  });
  await mockOrdersAPIs(page, {
    empty: options?.emptyOrders,
    error: options?.ordersError,
    delay: options?.delay,
  });
}

/**
 * Mock address APIs needed for checkout flow.
 */
export async function mockAddressAPIsForCheckout(page: Page, addresses?: any[]) {
  const addr = addresses || [
    {
      id: 'addr-1',
      user: 'test-user-id',
      name: 'Home',
      phone: '01712345678',
      country: 'Bangladesh',
      city: 'Dhaka',
      area: 'Uttara',
      postal_code: '1230',
      address_line: 'Sector 4, Road 1',
      type: 'shipping',
      is_default: true,
      created_at: '2026-06-01T00:00:00Z',
      updated_at: '2026-06-01T00:00:00Z',
    },
    {
      id: 'addr-2',
      user: 'test-user-id',
      name: 'Work',
      phone: '01812345678',
      country: 'Bangladesh',
      city: 'Dhaka',
      area: 'Gulshan',
      postal_code: '1212',
      address_line: 'Road 12, House 34',
      type: 'shipping',
      is_default: false,
      created_at: '2026-06-01T00:00:00Z',
      updated_at: '2026-06-01T00:00:00Z',
    },
  ];

  await page.route('**/api/v1/addresses/', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(addr) });
    } else if (route.request().method() === 'POST') {
      const body = route.request().postDataJSON();
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ ...body, id: 'addr-new', user: 'test-user-id', type: 'shipping', is_default: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }),
      });
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(addr[0]) });
    }
  });
}
