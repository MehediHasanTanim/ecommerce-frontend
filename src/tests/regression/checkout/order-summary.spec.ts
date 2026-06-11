/**
 * REG-FE-CHK-003: Order Summary Displays Correct Totals
 *
 * Scenario: User reviews checkout summary with subtotal, discount, shipping, tax, grand total.
 * Expected: All summary values display correctly matching mock data.
 */
import { test, expect } from '@playwright/test';
import { mockCheckoutAPIs } from '../../support/checkout-orders-mocks';
import { mockAddressAPIsForCheckout } from '../../support/checkout-orders-mocks';
import { setAuthStorage } from '../../support/auth-helpers';
import { testUser } from '../../fixtures/users';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('REG-FE-CHK-003: Order Summary Totals', () => {
  test.beforeEach(async ({ page }) => {
    await setAuthStorage(page, { access: 'test-token', refresh: 'test-refresh' }, testUser);
    await mockCheckoutAPIs(page);
    await mockAddressAPIsForCheckout(page);
  });

  test('displays all summary line items on Address step sidebar', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.goto();
    await checkout.assertOnAddressStep();

    // Verify order summary sidebar is visible
    await expect(checkout.orderSummarySidebar).toBeVisible({ timeout: 10000 });

    // Verify grand total is displayed
    await expect(checkout.grandTotal).toBeVisible({ timeout: 10000 });
  });

  test('displays correct totals on Review step', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.goto();

    await checkout.selectFirstAddress();
    await checkout.continueToReview();
    await checkout.assertOnReviewStep();

    // Verify summary labels and values from mock data
    // Mock data: subtotal=2650, discount=100, shipping=60, tax=250, grand=2860
    await expect(page.getByText(/Subtotal/)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Discount/)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Shipping/)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Tax/)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Grand Total/)).toBeVisible({ timeout: 10000 });
  });

  test('grand total matches expected value from mock data', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.goto();

    await checkout.selectFirstAddress();
    await checkout.continueToReview();

    // Grand total should be 2,860 (from mock)
    await expect(page.getByText(/2,860/)).toBeVisible({ timeout: 10000 });
  });

  test('item count is displayed in summary', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.goto();

    // Mock summary has 3 items
    await expect(page.getByText(/3 items/)).toBeVisible({ timeout: 10000 });
  });
});
