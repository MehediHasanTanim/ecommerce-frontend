/**
 * REG-FE-ORD-001: My Orders Page Lists Orders
 *
 * Scenario: User navigates to My Orders page.
 * Expected: Orders list displays with order numbers, statuses, totals, dates.
 *           Empty state shown when no orders exist.
 */
import { test, expect } from '@playwright/test';
import { mockOrdersAPIs } from '../../support/checkout-orders-mocks';
import { setAuthStorage } from '../../support/auth-helpers';
import { testUser } from '../../fixtures/users';
import { MyOrdersPage } from '../../pages/OrderPages';

test.describe('REG-FE-ORD-001: My Orders Page', () => {
  test.beforeEach(async ({ page }) => {
    await setAuthStorage(page, { access: 'test-token', refresh: 'test-refresh' }, testUser);
  });

  test('displays orders list heading', async ({ page }) => {
    await mockOrdersAPIs(page);
    const orders = new MyOrdersPage(page);
    await orders.goto();

    await expect(orders.heading).toBeVisible({ timeout: 10000 });
  });

  test('lists all mock orders with order numbers', async ({ page }) => {
    await mockOrdersAPIs(page);
    const orders = new MyOrdersPage(page);
    await orders.goto();

    await orders.assertOrderVisible('ORD-20260620-000001');
    await orders.assertOrderVisible('ORD-20260620-000002');
  });

  test('displays order status badges', async ({ page }) => {
    await mockOrdersAPIs(page);
    const orders = new MyOrdersPage(page);
    await orders.goto();

    // First order: pending, second: shipped
    await orders.assertStatusVisible('Pending');
    await orders.assertStatusVisible('Shipped');
  });

  test('displays order grand totals', async ({ page }) => {
    await mockOrdersAPIs(page);
    const orders = new MyOrdersPage(page);
    await orders.goto();

    // First order total: 2,710
    await orders.assertTotalVisible('2,710');
  });

  test('status filter tabs are visible', async ({ page }) => {
    await mockOrdersAPIs(page);
    const orders = new MyOrdersPage(page);
    await orders.goto();

    await expect(orders.filterAll).toBeVisible({ timeout: 10000 });
    await expect(orders.filterPending).toBeVisible({ timeout: 10000 });
    await expect(orders.filterShipped).toBeVisible({ timeout: 10000 });
  });

  test('order cards are clickable links to details', async ({ page }) => {
    await mockOrdersAPIs(page);
    const orders = new MyOrdersPage(page);
    await orders.goto();

    // Click on first order
    await orders.clickOrder('ORD-20260620-000001');

    // Should navigate to order details
    await expect(page).toHaveURL(/\/orders\/order-uuid-reg-001/, { timeout: 10000 });
  });
});

test.describe('REG-FE-ORD-001: Empty Orders State', () => {
  test.beforeEach(async ({ page }) => {
    await setAuthStorage(page, { access: 'test-token', refresh: 'test-refresh' }, testUser);
    await mockOrdersAPIs(page, { empty: true });
  });

  test('shows empty state when no orders exist', async ({ page }) => {
    const orders = new MyOrdersPage(page);
    await orders.goto();

    await orders.assertEmptyState();
  });

  test('Start Shopping button is visible in empty state', async ({ page }) => {
    const orders = new MyOrdersPage(page);
    await orders.goto();

    await expect(orders.startShoppingBtn).toBeVisible({ timeout: 10000 });
  });
});
