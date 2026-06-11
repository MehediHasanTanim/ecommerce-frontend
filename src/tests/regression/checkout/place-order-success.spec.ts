/**
 * REG-FE-CHK-004: Place Order Success Redirects To Success Page
 *
 * Scenario: User completes checkout and places an order.
 * Expected: Redirect to /order-success/:orderId, success message displayed,
 *           order number and details visible.
 */
import { test, expect } from '@playwright/test';
import { mockCheckoutAPIs } from '../../support/checkout-orders-mocks';
import { mockOrdersAPIs } from '../../support/checkout-orders-mocks';
import { mockAddressAPIsForCheckout } from '../../support/checkout-orders-mocks';
import { setAuthStorage } from '../../support/auth-helpers';
import { testUser } from '../../fixtures/users';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { OrderSuccessPage } from '../../pages/OrderPages';

test.describe('REG-FE-CHK-004: Place Order Success', () => {
  test.beforeEach(async ({ page }) => {
    await setAuthStorage(page, { access: 'test-token', refresh: 'test-refresh' }, testUser);
    await mockCheckoutAPIs(page);
    await mockOrdersAPIs(page);
    await mockAddressAPIsForCheckout(page);
  });

  test('redirects to order success page after placing order', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.goto();

    // Select address and go to review
    await checkout.selectFirstAddress();
    await checkout.continueToReview();
    await checkout.assertOnReviewStep();

    // Click Place Order
    await checkout.clickPlaceOrder();

    // Should redirect to order-success page
    await expect(page).toHaveURL(/order-success/, { timeout: 15000 });
  });

  test('displays success message on order success page', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.goto();

    await checkout.selectFirstAddress();
    await checkout.continueToReview();
    await checkout.clickPlaceOrder();

    // Wait for redirect
    await expect(page).toHaveURL(/order-success/, { timeout: 15000 });

    const successPage = new OrderSuccessPage(page);
    await successPage.assertSuccessMessage();
  });

  test('displays order number on success page', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.goto();

    await checkout.selectFirstAddress();
    await checkout.continueToReview();
    await checkout.clickPlaceOrder();

    await expect(page).toHaveURL(/order-success/, { timeout: 15000 });

    const successPage = new OrderSuccessPage(page);
    await successPage.assertOrderNumber('ORD-20260620-000001');
  });

  test('View Order button is visible on success page', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.goto();

    await checkout.selectFirstAddress();
    await checkout.continueToReview();
    await checkout.clickPlaceOrder();

    await expect(page).toHaveURL(/order-success/, { timeout: 15000 });

    const successPage = new OrderSuccessPage(page);
    await successPage.assertViewOrderButton();
  });

  test('Continue Shopping button is visible on success page', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.goto();

    await checkout.selectFirstAddress();
    await checkout.continueToReview();
    await checkout.clickPlaceOrder();

    await expect(page).toHaveURL(/order-success/, { timeout: 15000 });

    const successPage = new OrderSuccessPage(page);
    await successPage.assertContinueShoppingButton();
  });
});
