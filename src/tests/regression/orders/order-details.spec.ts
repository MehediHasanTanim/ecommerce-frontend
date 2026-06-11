/**
 * REG-FE-ORD-002: Order Details Page Displays Status, Items, And Totals
 *
 * Scenario: User views a specific order's details.
 * Expected: Order number, status, items, quantities, pricing, totals rendered correctly.
 */
import { test, expect } from '@playwright/test';
import { mockOrdersAPIs } from '../../support/checkout-orders-mocks';
import { setAuthStorage } from '../../support/auth-helpers';
import { testUser } from '../../fixtures/users';
import { OrderDetailsPage } from '../../pages/OrderPages';

test.describe('REG-FE-ORD-002: Order Details Page', () => {
  test.beforeEach(async ({ page }) => {
    await setAuthStorage(page, { access: 'test-token', refresh: 'test-refresh' }, testUser);
    await mockOrdersAPIs(page);
  });

  test('displays order number on details page', async ({ page }) => {
    const details = new OrderDetailsPage(page);
    await details.goto('order-uuid-reg-001');

    await details.assertOrderNumber('ORD-20260620-000001');
  });

  test('displays order status badge', async ({ page }) => {
    const details = new OrderDetailsPage(page);
    await details.goto('order-uuid-reg-001');

    await details.assertStatusVisible('Pending');
  });

  test('displays product names in order items', async ({ page }) => {
    const details = new OrderDetailsPage(page);
    await details.goto('order-uuid-reg-001');

    await details.assertProductVisible('iPhone 16 Pro');
  });

  test('displays grand total on details page', async ({ page }) => {
    const details = new OrderDetailsPage(page);
    await details.goto('order-uuid-reg-001');

    // Grand total from mock: 2,600
    await details.assertTotalVisible('2,600');
  });

  test('displays shipping address when present', async ({ page }) => {
    const details = new OrderDetailsPage(page);
    await details.goto('order-uuid-reg-001');

    // Mock order has an address
    await expect(details.shippingAddressSection).toBeVisible({ timeout: 10000 });
  });

  test('Back to Orders button navigates to orders list', async ({ page }) => {
    const details = new OrderDetailsPage(page);
    await details.goto('order-uuid-reg-001');

    await expect(details.backToOrdersBtn).toBeVisible({ timeout: 10000 });
    await details.backToOrdersBtn.click();

    await expect(page).toHaveURL(/\/orders/, { timeout: 10000 });
  });

  test('displays totals section with breakdown', async ({ page }) => {
    const details = new OrderDetailsPage(page);
    await details.goto('order-uuid-reg-001');

    await expect(details.totalsSection).toBeVisible({ timeout: 10000 });
    await expect(details.grandTotal).toBeVisible({ timeout: 10000 });
  });
});

test.describe('REG-FE-ORD-002: Cancel Order Flow', () => {
  test.beforeEach(async ({ page }) => {
    await setAuthStorage(page, { access: 'test-token', refresh: 'test-refresh' }, testUser);
    await mockOrdersAPIs(page);
  });

  test('Cancel Order button visible for pending orders', async ({ page }) => {
    const details = new OrderDetailsPage(page);
    await details.goto('order-uuid-reg-001');

    // Mock order is 'pending' — cancel button should be visible
    await details.assertCancelButtonVisible();
  });
});
