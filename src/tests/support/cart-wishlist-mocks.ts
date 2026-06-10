import { Page } from '@playwright/test';
import { cartFixtures, wishlistFixtures } from '../fixtures/cart-wishlist';

/**
 * Mock all Cart API endpoints for Playwright tests.
 * Uses a single catch-all route handler for reliability.
 */
export async function mockCartAPIs(page: Page, options?: {
  empty?: boolean;
  delay?: number;
  simulateError?: boolean;
}) {
  const cart = options?.empty ? cartFixtures.empty : cartFixtures.singleItem;
  const delay = options?.delay ?? 0;

  if (options?.simulateError) {
    await page.route('**/*', async (route) => {
      const url = route.request().url();
      if (url.includes('/api/v1/cart')) {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ detail: 'Unable to load cart' }),
        });
      } else {
        await route.continue();
      }
    });
    return;
  }

  // Catch-all route for cart APIs
  await page.route('**/*', async (route) => {
    const url = route.request().url();
    const method = route.request().method();

    // GET /api/v1/cart/
    if (method === 'GET' && url.endsWith('/api/v1/cart/')) {
      if (delay) await new Promise(r => setTimeout(r, delay));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(cart),
      });
      return;
    }

    // POST /api/v1/cart/add/
    if (method === 'POST' && url.endsWith('/api/v1/cart/add/')) {
      const body = route.request().postDataJSON();
      const qty = body.quantity ?? 1;
      const updatedCart = { ...cartFixtures.singleItem, item_count: qty };
      if (delay) await new Promise(r => setTimeout(r, delay));
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(updatedCart),
      });
      return;
    }

    // PUT /api/v1/cart/items/{id}/
    if (method === 'PUT' && url.includes('/api/v1/cart/items/')) {
      const body = route.request().postDataJSON();
      const updatedItems = cart.items.map((item) => ({
        ...item,
        quantity: body.quantity,
        line_total: (parseFloat(item.unit_price) * body.quantity).toFixed(2),
      }));
      const subtotal = updatedItems.reduce((s: number, i: any) => s + parseFloat(i.line_total), 0);
      if (delay) await new Promise(r => setTimeout(r, delay));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...cart,
          items: updatedItems,
          subtotal,
          grand_total: Math.max(0, subtotal - cart.discount),
          item_count: updatedItems.reduce((s: number, i: any) => s + i.quantity, 0),
        }),
      });
      return;
    }

    // DELETE /api/v1/cart/items/{id}/delete/
    if (method === 'DELETE' && url.includes('/api/v1/cart/items/') && url.endsWith('/delete/')) {
      if (delay) await new Promise(r => setTimeout(r, delay));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...cartFixtures.empty,
          items: [],
          subtotal: 0,
          grand_total: 0,
          item_count: 0,
        }),
      });
      return;
    }

    // POST /api/v1/cart/coupons/apply/
    if (method === 'POST' && url.endsWith('/api/v1/cart/coupons/apply/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...cart,
          discount: 50,
          grand_total: cart.subtotal - 50,
          coupon: 1,
          coupon_code: 'SAVE50',
        }),
      });
      return;
    }

    // DELETE /api/v1/cart/coupons/remove/
    if (method === 'DELETE' && url.endsWith('/api/v1/cart/coupons/remove/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...cart,
          discount: 0,
          grand_total: cart.subtotal,
          coupon: null,
          coupon_code: null,
        }),
      });
      return;
    }

    // Mock auth/refresh to prevent 401 loops
    if (method === 'POST' && url.endsWith('/api/v1/auth/refresh/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ access: 'mock-access-token' }),
      });
      return;
    }

    // Pass through everything else
    await route.continue();
  });
}

/**
 * Mock all Wishlist API endpoints for Playwright tests.
 */
export async function mockWishlistAPIs(page: Page, options?: {
  empty?: boolean;
  simulateError?: boolean;
}) {
  const wishlist = options?.empty ? wishlistFixtures.empty : wishlistFixtures.singleItem;

  if (options?.simulateError) {
    await page.route('**/*', async (route) => {
      const url = route.request().url();
      if (url.includes('/api/v1/wishlist')) {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ detail: 'Failed to update wishlist' }),
        });
      } else {
        await route.continue();
      }
    });
    return;
  }

  // Catch-all for wishlist
  await page.route('**/*', async (route) => {
    const url = route.request().url();
    const method = route.request().method();

    // GET /api/v1/wishlist/
    if (method === 'GET' && url.endsWith('/api/v1/wishlist/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(wishlist),
      });
      return;
    }

    // POST /api/v1/wishlist/add/
    if (method === 'POST' && url.endsWith('/api/v1/wishlist/add/')) {
      const body = route.request().postDataJSON();
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: `wish-uuid-new-${body.product_id}`,
          product_id: body.product_id,
          product_name: 'iPhone 16 Pro',
          product_slug: 'iphone-16-pro',
          image_url: null,
          price: '999.00',
          in_stock: true,
          created_at: new Date().toISOString(),
        }),
      });
      return;
    }

    // DELETE /api/v1/wishlist/:product_id/
    if (method === 'DELETE' && url.includes('/api/v1/wishlist/') && !url.includes('/add/')) {
      await route.fulfill({ status: 204 });
      return;
    }

    await route.continue();
  });
}

/**
 * Convenience: mock both cart and wishlist APIs together.
 */
export async function mockAllStoreAPIs(page: Page, options?: {
  cartEmpty?: boolean;
  wishlistEmpty?: boolean;
  simulateCartError?: boolean;
  simulateWishlistError?: boolean;
}) {
  await mockCartAPIs(page, {
    empty: options?.cartEmpty,
    simulateError: options?.simulateCartError,
  });
  await mockWishlistAPIs(page, {
    empty: options?.wishlistEmpty,
    simulateError: options?.simulateWishlistError,
  });
}
