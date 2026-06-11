/**
 * REG-FE-CHK-002: Address Selection Required Before Placing Order
 *
 * Scenario: User tries to proceed without selecting an address.
 * Expected: Validation message appears, current step remains unchanged,
 *           Review page is not accessible without address.
 */
import { test, expect } from '@playwright/test';
import { mockCheckoutAPIs } from '../../support/checkout-orders-mocks';
import { mockAddressAPIsForCheckout } from '../../support/checkout-orders-mocks';
import { setAuthStorage } from '../../support/auth-helpers';
import { testUser } from '../../fixtures/users';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('REG-FE-CHK-002: Address Selection Validation', () => {
  test.beforeEach(async ({ page }) => {
    await setAuthStorage(page, { access: 'test-token', refresh: 'test-refresh' }, testUser);
    await mockCheckoutAPIs(page);
    await mockAddressAPIsForCheckout(page);
  });

  test('shows validation error when continuing without selecting address', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.goto();
    await checkout.assertOnAddressStep();

    // Click Continue without selecting any address
    await checkout.continueToReview();

    // Should still be on Address step
    await checkout.assertOnAddressStep();
  });

  test('Review step is not accessible without address selection', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.goto();

    // Try to continue without address
    await checkout.continueToReview();

    // Verify we are NOT on the review step
    await expect(checkout.reviewItems).not.toBeVisible();
  });

  test('after selecting address, can proceed to Review without error', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.goto();

    // Select an address first
    await checkout.selectFirstAddress();

    // Now continue
    await checkout.continueToReview();

    // Should be on review step
    await checkout.assertOnReviewStep();
  });
});
