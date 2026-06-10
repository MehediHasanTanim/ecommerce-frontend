/**
 * Negative Scenarios for Cart & Wishlist
 *
 * CART-FE-NEG-001: Quantity exceeds stock — "Maximum stock reached" message
 * CART-FE-NEG-002: Wishlist API failure — error displayed
 * CART-FE-NEG-003: Cart API unavailable — error state shown
 */
import { test, expect } from '@playwright/test';
import { mockAllStoreAPIs } from '../../support/cart-wishlist-mocks';
import { CartPage } from '../../pages/CartPage';
import { WishlistPage } from '../../pages/WishlistPage';
import { setAuthStorage } from '../../support/auth-helpers';
import { testUser } from '../../fixtures/users';

test.describe('Negative Scenarios', () => {
  test.describe('CART-FE-NEG-001: Quantity Exceeds Stock', () => {
    test.beforeEach(async ({ page }) => {
      await setAuthStorage(page, { access: 'test-token', refresh: 'test-refresh' }, testUser);
      await mockAllStoreAPIs(page);
    });

    test('shows "Maximum stock reached" when quantity equals stock', async ({ page }) => {
      const cartPage = new CartPage(page);

      await cartPage.goto();
      await expect(cartPage.orderSummary).toBeVisible();

      // Increase quantity up to stock limit (20)
      // After 19 increases from 1 → 20
      for (let i = 0; i < 19; i++) {
        await cartPage.increaseQuantity('iPhone 16 Pro');
        await page.waitForTimeout(50); // Small delay for mock response
      }

      // At max stock, the increase button should eventually show the warning
      // The mock returns stock_quantity: 20
      await expect(
        page.getByText(/maximum stock reached/i)
      ).toBeVisible({ timeout: 5000 });
    });

    test('increase button is disabled at max stock', async ({ page }) => {
      const cartPage = new CartPage(page);

      await cartPage.goto();
      await expect(cartPage.orderSummary).toBeVisible();

      // Increase up to max stock
      for (let i = 0; i < 19; i++) {
        await cartPage.increaseQuantity('iPhone 16 Pro');
        await page.waitForTimeout(50);
      }

      // At max stock, increase button should be disabled
      const increaseBtn = page.locator('[data-testid^="cart-item-"]').first()
        .getByRole('button', { name: /increase quantity/i });
      await expect(increaseBtn).toBeDisabled();
    });
  });

  test.describe('CART-FE-NEG-002: Wishlist API Failure', () => {
    test.beforeEach(async ({ page }) => {
      await setAuthStorage(page, { access: 'test-token', refresh: 'test-refresh' }, testUser);
      await mockAllStoreAPIs(page, { simulateWishlistError: true });
    });

    test('shows error state when wishlist API fails', async ({ page }) => {
      const wishlistPage = new WishlistPage(page);

      await wishlistPage.goto();

      await wishlistPage.assertError();
    });

    test('shows retry button on wishlist error', async ({ page }) => {
      const wishlistPage = new WishlistPage(page);

      await wishlistPage.goto();

      await expect(
        page.getByRole('button', { name: /retry/i })
      ).toBeVisible();
    });
  });

  test.describe('CART-FE-NEG-003: Cart API Unavailable', () => {
    test.beforeEach(async ({ page }) => {
      await setAuthStorage(page, { access: 'test-token', refresh: 'test-refresh' }, testUser);
      await mockAllStoreAPIs(page, { simulateCartError: true });
    });

    test('shows error state when cart API is unavailable', async ({ page }) => {
      const cartPage = new CartPage(page);

      await cartPage.goto();

      await expect(cartPage.errorState).toBeVisible();
      await expect(
        page.getByText(/failed to load cart/i)
      ).toBeVisible();
    });

    test('shows retry button on cart error', async ({ page }) => {
      const cartPage = new CartPage(page);

      await cartPage.goto();

      await expect(
        page.getByRole('button', { name: /retry/i })
      ).toBeVisible();
    });
  });
});
