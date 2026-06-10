/**
 * CART-FE-REG-004: Remove item updates UI
 *
 * Scenario: User removes an item from cart
 * Expected: Item disappears, cart count decreases, totals update
 */
import { test, expect } from '@playwright/test';
import { mockAllStoreAPIs } from '../../support/cart-wishlist-mocks';
import { CartPage } from '../../pages/CartPage';
import { setAuthStorage } from '../../support/auth-helpers';
import { testUser } from '../../fixtures/users';

test.describe('CART-FE-REG-004: Remove Item Updates UI', () => {
  test.beforeEach(async ({ page }) => {
    await setAuthStorage(page, { access: 'test-token', refresh: 'test-refresh' }, testUser);
    await mockAllStoreAPIs(page, { cartEmpty: false });
  });

  test('removing item removes it from the DOM', async ({ page }) => {
    const cartPage = new CartPage(page);

    await cartPage.goto();
    await expect(cartPage.orderSummary).toBeVisible();

    // Item should be visible initially
    await cartPage.assertItemVisible('iPhone 16 Pro');

    // Click remove
    await cartPage.removeItem('iPhone 16 Pro');

    // Mock removes the single item → cart should show empty state
    await expect(cartPage.emptyState).toBeVisible();
  });

  test('remove button has accessible label', async ({ page }) => {
    const cartPage = new CartPage(page);

    await cartPage.goto();
    await expect(cartPage.orderSummary).toBeVisible();

    // Remove button should be present with correct label
    const removeBtn = page.getByRole('button', { name: /remove iphone 16 pro from cart/i });
    await expect(removeBtn).toBeVisible();
  });

  test('cart item count updates after removal', async ({ page }) => {
    const cartPage = new CartPage(page);

    await cartPage.goto();
    await expect(cartPage.orderSummary).toBeVisible();

    const initialCount = await cartPage.getItemCount();
    expect(initialCount).toBeGreaterThan(0);

    await cartPage.removeItem('iPhone 16 Pro');

    // After removal, empty state should appear (mock returns empty cart)
    await expect(cartPage.emptyState).toBeVisible();
  });

  test('cart shows empty state after removing last item', async ({ page }) => {
    const cartPage = new CartPage(page);

    await cartPage.goto();
    await expect(cartPage.orderSummary).toBeVisible();

    await cartPage.removeItem('iPhone 16 Pro');

    // Should show empty cart
    await cartPage.assertEmpty();
    await expect(cartPage.page.getByText(/your cart is empty/i)).toBeVisible();
  });
});
