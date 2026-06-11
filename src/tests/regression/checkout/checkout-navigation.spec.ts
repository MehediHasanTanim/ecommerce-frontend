/**
 * REG-FE-CHK-001: Checkout Page Step Navigation Works
 *
 * Scenario: User navigates through checkout steps (Address → Review → back to Address).
 * Expected: Step indicators update, selected data is preserved, back navigation works.
 */
import { test, expect } from '@playwright/test';
import { mockCheckoutAPIs } from '../../support/checkout-orders-mocks';
import { mockAddressAPIsForCheckout } from '../../support/checkout-orders-mocks';
import { setAuthStorage } from '../../support/auth-helpers';
import { testUser } from '../../fixtures/users';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('REG-FE-CHK-001: Checkout Step Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await setAuthStorage(page, { access: 'test-token', refresh: 'test-refresh' }, testUser);
    await mockCheckoutAPIs(page);
    await mockAddressAPIsForCheckout(page);
  });

  test('starts at Address step with stepper showing step 1 as active', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.goto();

    // Verify heading
    await expect(checkout.heading).toBeVisible();

    // Verify stepper is visible
    await expect(checkout.stepper).toBeVisible();

    // Verify Address section is visible (step 1)
    await checkout.assertOnAddressStep();
  });

  test('navigates from Address step to Review step after selecting address', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.goto();

    // Select first address
    await checkout.selectFirstAddress();

    // Click Continue to Review
    await checkout.continueToReview();

    // Should now be on Review step
    await checkout.assertOnReviewStep();
  });

  test('navigates back from Review step to Address step', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.goto();

    // Navigate to Review
    await checkout.selectFirstAddress();
    await checkout.continueToReview();
    await checkout.assertOnReviewStep();

    // Navigate back to Address
    await checkout.goBackToAddress();
    await checkout.assertOnAddressStep();
  });

  test('selected address is preserved when navigating back and forth', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.goto();

    // Select an address
    await checkout.selectFirstAddress();

    // Navigate forward
    await checkout.continueToReview();
    await checkout.assertOnReviewStep();

    // Navigate back
    await checkout.goBackToAddress();
    await checkout.assertOnAddressStep();

    // Navigate forward again
    await checkout.continueToReview();
    await checkout.assertOnReviewStep();
  });

  test('Place Order button is visible on Review step', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.goto();

    await checkout.selectFirstAddress();
    await checkout.continueToReview();

    await expect(checkout.placeOrderBtn).toBeVisible({ timeout: 10000 });
  });
});
