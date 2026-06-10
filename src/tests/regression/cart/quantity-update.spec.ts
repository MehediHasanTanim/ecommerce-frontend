/**
 * CART-FE-REG-003: Cart quantity update changes totals
 *
 * Scenario: User increases item quantity on cart page
 * Expected: Quantity updates, subtotal/total recalculate
 */
import { test, expect } from '@playwright/test';
import { mockAllStoreAPIs } from '../../support/cart-wishlist-mocks';
import { CartPage } from '../../pages/CartPage';
import { setAuthStorage } from '../../support/auth-helpers';
import { testUser } from '../../fixtures/users';

test.describe('CART-FE-REG-003: Cart Quantity Update Changes Totals', () => {
  test.beforeEach(async ({ page }) => {
    await setAuthStorage(page, { access: 'test-token', refresh: 'test-refresh' }, testUser);
    await mockAllStoreAPIs(page, { cartEmpty: false });
  });

  test('increasing quantity updates the displayed quantity', async ({ page }) => {
    const cartPage = new CartPage(page);

    await cartPage.goto();

    // Wait for cart to load
    await expect(cartPage.orderSummary).toBeVisible();

    // Initial quantity should be 1
    const initialQty = await cartPage.getQuantityForItem('iPhone 16 Pro');
    expect(initialQty.trim()).toBe('1');

    // Click increase
    await cartPage.increaseQuantity('iPhone 16 Pro');

    // After mock response, quantity should be 2
    await expect(
      page.locator('[data-testid^="cart-item-"]').first().locator('[aria-live="polite"]')
    ).toHaveText('2');
  });

  test('decreasing quantity works correctly', async ({ page }) => {
    const cartPage = new CartPage(page);

    await cartPage.goto();
    await expect(cartPage.orderSummary).toBeVisible();

    // First increase to get to qty 2
    await cartPage.increaseQuantity('iPhone 16 Pro');
    await expect(
      page.locator('[data-testid^="cart-item-"]').first().locator('[aria-live="polite"]')
    ).toHaveText('2');

    // Then decrease
    await cartPage.decreaseQuantity('iPhone 16 Pro');
    await expect(
      page.locator('[data-testid^="cart-item-"]').first().locator('[aria-live="polite"]')
    ).toHaveText('1');
  });

  test('subtotal updates when quantity changes', async ({ page }) => {
    const cartPage = new CartPage(page);

    await cartPage.goto();
    await expect(cartPage.orderSummary).toBeVisible();

    // Initial subtotal should be $999.00
    await expect(cartPage.subtotalText).toContainText('999');

    // Increase quantity
    await cartPage.increaseQuantity('iPhone 16 Pro');

    // Subtotal should now be $1998.00 (2 × $999)
    await expect(cartPage.subtotalText).toContainText('1998');
  });

  test('quantity selector has increase and decrease buttons', async ({ page }) => {
    const cartPage = new CartPage(page);

    await cartPage.goto();
    await expect(cartPage.orderSummary).toBeVisible();

    // Both buttons should be present
    const firstItem = page.locator('[data-testid^="cart-item-"]').first();
    await expect(firstItem.getByRole('button', { name: /increase/i })).toBeVisible();
    await expect(firstItem.getByRole('button', { name: /decrease/i })).toBeVisible();
  });
});
