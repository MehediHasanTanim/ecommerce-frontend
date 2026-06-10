/**
 * CART-FE-REG-002: Mini cart drawer shows added item
 *
 * Scenario: User opens mini cart drawer after adding item
 * Expected: Drawer displays product image, name, quantity, price, subtotal
 */
import { test, expect } from '@playwright/test';
import { mockAllStoreAPIs } from '../../support/cart-wishlist-mocks';
import { MiniCartDrawer } from '../../pages/MiniCartDrawer';
import { setAuthStorage } from '../../support/auth-helpers';
import { testUser } from '../../fixtures/users';

test.describe('CART-FE-REG-002: Mini Cart Drawer Shows Added Item', () => {
  test.beforeEach(async ({ page }) => {
    await setAuthStorage(page, { access: 'test-token', refresh: 'test-refresh' }, testUser);
    await mockAllStoreAPIs(page);
  });

  test('mini cart drawer opens when cart icon is clicked', async ({ page }) => {
    const miniCart = new MiniCartDrawer(page);

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    // networkidle removed, using waitForTimeout above

    await miniCart.open();

    // Drawer should be visible
    await expect(miniCart.drawerHeading).toBeVisible();
  });

  test('mini cart drawer shows added item details', async ({ page }) => {
    const miniCart = new MiniCartDrawer(page);

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    // networkidle removed, using waitForTimeout above

    await miniCart.open();

    // Verify item is visible in drawer
    await miniCart.assertItemVisible('iPhone 16 Pro');

    // Verify quantity is shown
    await expect(page.getByText(/Qty: 1/)).toBeVisible();

    // Verify price is shown ($999.00)
    await expect(miniCart.drawer.getByText('$999.00')).toBeVisible();
  });

  test('mini cart drawer shows subtotal', async ({ page }) => {
    const miniCart = new MiniCartDrawer(page);

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    // networkidle removed, using waitForTimeout above

    await miniCart.open();

    // Subtotal should be visible
    await miniCart.assertSubtotal('$999.00');
  });

  test('mini cart drawer can be closed via close button', async ({ page }) => {
    const miniCart = new MiniCartDrawer(page);

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    // networkidle removed, using waitForTimeout above

    await miniCart.open();
    await miniCart.close();

    // Drawer should not be visible
    await expect(miniCart.drawer).not.toBeVisible();
  });

  test('mini cart drawer can be closed via Escape key', async ({ page }) => {
    const miniCart = new MiniCartDrawer(page);

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    // networkidle removed, using waitForTimeout above

    await miniCart.open();
    await miniCart.closeViaEscape();

    await expect(miniCart.drawer).not.toBeVisible();
  });

  test('mini cart drawer can be closed via backdrop click', async ({ page }) => {
    const miniCart = new MiniCartDrawer(page);

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    // networkidle removed, using waitForTimeout above

    await miniCart.open();
    await miniCart.closeViaBackdrop();

    await expect(miniCart.drawer).not.toBeVisible();
  });

  test('mini cart has View Cart and Checkout links', async ({ page }) => {
    const miniCart = new MiniCartDrawer(page);

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    // networkidle removed, using waitForTimeout above

    await miniCart.open();

    await expect(miniCart.viewCartBtn).toBeVisible();
    await expect(miniCart.checkoutBtn).toBeVisible();
  });

  test('View Cart link navigates to cart page', async ({ page }) => {
    const miniCart = new MiniCartDrawer(page);

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    // networkidle removed, using waitForTimeout above

    await miniCart.open();
    await miniCart.clickViewCart();

    await expect(page).toHaveURL(/cart/);
  });
});
