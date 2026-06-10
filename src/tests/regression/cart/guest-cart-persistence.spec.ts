/**
 * CART-FE-REG-006: Guest cart persists after refresh
 *
 * Scenario: Guest user adds item to cart, refreshes, and sees the item still there.
 * Guest cart persistence relies on the backend guest_token or localStorage.
 */
import { test, expect } from '@playwright/test';
import { mockAllStoreAPIs } from '../../support/cart-wishlist-mocks';
import { CartPage } from '../../pages/CartPage';
import { MiniCartDrawer } from '../../pages/MiniCartDrawer';
import { clearAuthStorage } from '../../support/auth-helpers';

test.describe('CART-FE-REG-006: Guest Cart Persists After Refresh', () => {
  test.beforeEach(async ({ page }) => {
    // No auth — simulate guest user
    await clearAuthStorage(page);
    await mockAllStoreAPIs(page);
  });

  test('cart items remain visible after page refresh', async ({ page }) => {
    const cartPage = new CartPage(page);

    await cartPage.goto();
    await expect(cartPage.orderSummary).toBeVisible();

    // Verify item is visible before refresh
    await cartPage.assertItemVisible('iPhone 16 Pro');

    // Refresh the page
    await page.reload();
    // networkidle removed, using waitForTimeout above

    // Item should still be visible (mock returns same cart)
    await cartPage.assertItemVisible('iPhone 16 Pro');
  });

  test('cart badge count persists after refresh', async ({ page }) => {
    const miniCart = new MiniCartDrawer(page);

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    // networkidle removed, using waitForTimeout above

    // Check badge before refresh
    await miniCart.assertBadgeCount('1');

    // Refresh
    await page.reload();
    // networkidle removed, using waitForTimeout above

    // Badge count should persist
    await miniCart.assertBadgeCount('1');
  });

  test('mini cart drawer shows item after refresh', async ({ page }) => {
    const miniCart = new MiniCartDrawer(page);

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    // networkidle removed, using waitForTimeout above

    // Refresh and then open mini cart
    await page.reload();
    // networkidle removed, using waitForTimeout above

    await miniCart.open();
    await miniCart.assertItemVisible('iPhone 16 Pro');
  });
});
