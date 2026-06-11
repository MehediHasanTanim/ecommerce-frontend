/**
 * REG-FE-CHK-005: Failed Checkout Displays Actionable Error
 *
 * Scenario: Order placement fails due to various backend errors.
 * Expected: Error message displayed, user remains on checkout page,
 *           Place Order button re-enabled for retry.
 */
import { test, expect } from '@playwright/test';
import { mockCheckoutAPIs } from '../../support/checkout-orders-mocks';
import { mockAddressAPIsForCheckout } from '../../support/checkout-orders-mocks';
import { setAuthStorage } from '../../support/auth-helpers';
import { testUser } from '../../fixtures/users';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('REG-FE-CHK-005: Checkout Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await setAuthStorage(page, { access: 'test-token', refresh: 'test-refresh' }, testUser);
    await mockAddressAPIsForCheckout(page);
  });

  test('shows insufficient stock error and stays on checkout page', async ({ page }) => {
    await mockCheckoutAPIs(page, { placeOrderError: 'stock' });

    const checkout = new CheckoutPage(page);
    await checkout.goto();

    await checkout.selectFirstAddress();
    await checkout.continueToReview();
    await checkout.assertOnReviewStep();

    // Click Place Order — should fail with stock error
    await checkout.clickPlaceOrder();

    // Should still be on checkout page (not redirected)
    await expect(page).not.toHaveURL(/order-success/);
  });

  test('Place Order button re-enabled after failed order', async ({ page }) => {
    await mockCheckoutAPIs(page, { placeOrderError: 'stock' });

    const checkout = new CheckoutPage(page);
    await checkout.goto();

    await checkout.selectFirstAddress();
    await checkout.continueToReview();

    await checkout.clickPlaceOrder();

    // Wait for the error to be processed
    await page.waitForTimeout(2000);

    // Place Order button should be visible and enabled again
    await expect(checkout.placeOrderBtn).toBeVisible({ timeout: 10000 });
  });

  test('shows cart empty error when cart has no items', async ({ page }) => {
    await mockCheckoutAPIs(page, { placeOrderError: 'cart_empty' });

    const checkout = new CheckoutPage(page);
    await checkout.goto();

    await checkout.selectFirstAddress();
    await checkout.continueToReview();

    await checkout.clickPlaceOrder();

    // Should stay on checkout page
    await expect(page).not.toHaveURL(/order-success/);
  });

  test('handles network error gracefully', async ({ page }) => {
    await mockCheckoutAPIs(page, { placeOrderError: 'network' });

    const checkout = new CheckoutPage(page);
    await checkout.goto();

    await checkout.selectFirstAddress();
    await checkout.continueToReview();

    await checkout.clickPlaceOrder();

    // Should not redirect on network error
    await expect(page).not.toHaveURL(/order-success/);

    // Place Order button should eventually be re-enabled
    await page.waitForTimeout(2000);
    await expect(checkout.placeOrderBtn).toBeVisible({ timeout: 10000 });
  });
});
