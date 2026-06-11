import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Order Success Page (/order-success/:orderId).
 */
export class OrderSuccessPage {
  readonly page: Page;
  readonly successHeading: Locator;
  readonly successIcon: Locator;
  readonly orderNumber: Locator;
  readonly statusBadge: Locator;
  readonly grandTotal: Locator;
  readonly viewOrderBtn: Locator;
  readonly continueShoppingBtn: Locator;
  readonly myOrdersBtn: Locator;
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.successHeading = page.getByText(/order placed successfully/i);
    this.orderNumber = page.getByText(/ORD-/);
    this.statusBadge = page.getByText(/pending|confirmed|processing|shipped|delivered|cancelled/i);
    this.grandTotal = page.locator('text=Grand Total').first();
    this.viewOrderBtn = page.getByRole('button', { name: /view order/i });
    this.continueShoppingBtn = page.getByRole('button', { name: /continue shopping/i });
    this.myOrdersBtn = page.getByRole('button', { name: /my orders/i });
    this.loadingSpinner = page.getByTestId('loader');
  }

  async assertSuccessMessage() {
    await expect(this.successHeading).toBeVisible({ timeout: 10000 });
  }

  async assertOrderNumber(expected: string) {
    await expect(this.page.getByText(expected)).toBeVisible({ timeout: 10000 });
  }

  async assertViewOrderButton() {
    await expect(this.viewOrderBtn).toBeVisible();
  }

  async assertContinueShoppingButton() {
    await expect(this.continueShoppingBtn).toBeVisible();
  }

  async clickViewOrder() {
    await this.viewOrderBtn.click();
  }

  async clickContinueShopping() {
    await this.continueShoppingBtn.click();
  }
}

/**
 * Page Object Model for the My Orders Page (/orders).
 */
export class MyOrdersPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly filterTabs: Locator;
  readonly filterAll: Locator;
  readonly filterPending: Locator;
  readonly filterShipped: Locator;
  readonly orderCards: Locator;
  readonly emptyState: Locator;
  readonly emptyText: Locator;
  readonly startShoppingBtn: Locator;
  readonly loadingSkeleton: Locator;
  readonly errorState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /my orders/i, level: 1 });
    this.filterTabs = page.locator('button').filter({ hasText: /All|Pending|Confirmed|Processing|Shipped|Delivered|Cancelled/ });
    this.filterAll = page.getByRole('button', { name: /^All$/ });
    this.filterPending = page.getByRole('button', { name: /^Pending$/ });
    this.filterShipped = page.getByRole('button', { name: /^Shipped$/ });
    this.orderCards = page.getByRole('link').filter({ has: page.locator('[class*="font-semibold"]') });
    this.emptyState = page.getByTestId('orders-empty-state');
    this.emptyText = page.getByText(/you haven't placed any orders yet/i);
    this.startShoppingBtn = page.getByRole('button', { name: /start shopping/i });
    this.loadingSkeleton = page.getByTestId('orders-list-skeleton');
    this.errorState = page.getByText(/failed to load orders/i);
  }

  async goto() {
    await this.page.goto('/orders', { waitUntil: 'domcontentloaded' });
    await this.page.waitForTimeout(3000);
  }

  async assertOrderVisible(orderNumber: string) {
    await expect(this.page.getByText(orderNumber)).toBeVisible({ timeout: 10000 });
  }

  async assertStatusVisible(status: string) {
    await expect(this.page.getByText(status, { exact: true }).first()).toBeVisible({ timeout: 10000 });
  }

  async assertTotalVisible(total: string) {
    await expect(this.page.getByText(total)).toBeVisible({ timeout: 10000 });
  }

  async assertEmptyState() {
    await expect(this.emptyText).toBeVisible({ timeout: 10000 });
  }

  async clickOrder(orderNumber: string) {
    await this.page.getByText(orderNumber).click();
  }
}

/**
 * Page Object Model for the Order Details Page (/orders/:id).
 */
export class OrderDetailsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly orderNumber: Locator;
  readonly statusBadge: Locator;
  readonly backToOrdersBtn: Locator;
  readonly cancelOrderBtn: Locator;
  readonly cancelDialog: Locator;
  readonly confirmCancelBtn: Locator;
  readonly keepOrderBtn: Locator;
  readonly shippingAddressSection: Locator;
  readonly itemsSection: Locator;
  readonly totalsSection: Locator;
  readonly grandTotal: Locator;
  readonly loadingSkeleton: Locator;
  readonly errorState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /order details/i, level: 1 });
    this.orderNumber = page.getByText(/ORD-/);
    this.statusBadge = page.locator('[class*="rounded-full"]');
    this.backToOrdersBtn = page.getByRole('button', { name: /back to orders/i });
    this.cancelOrderBtn = page.getByRole('button', { name: /cancel order/i });
    this.cancelDialog = page.getByRole('dialog', { name: /cancel order/i });
    this.confirmCancelBtn = page.getByRole('button', { name: /cancel order/i }).last();
    this.keepOrderBtn = page.getByRole('button', { name: /keep order/i });
    this.shippingAddressSection = page.getByText('Shipping Address').first();
    this.itemsSection = page.getByText(/Items/).first();
    this.totalsSection = page.getByText('Order Totals').first();
    this.grandTotal = page.getByText('Grand Total').first();
    this.loadingSkeleton = page.getByTestId('order-details-skeleton');
    this.errorState = page.getByText(/order not found/i);
  }

  async goto(orderId: string) {
    await this.page.goto(`/orders/${orderId}`, { waitUntil: 'domcontentloaded' });
    await this.page.waitForTimeout(3000);
  }

  async assertOrderNumber(expected: string) {
    await expect(this.page.getByText(expected)).toBeVisible({ timeout: 10000 });
  }

  async assertStatusVisible(status: string) {
    await expect(this.page.getByText(status, { exact: true }).first()).toBeVisible({ timeout: 10000 });
  }

  async assertProductVisible(productName: string) {
    await expect(this.page.getByText(productName)).toBeVisible({ timeout: 10000 });
  }

  async assertTotalVisible(total: string) {
    await expect(this.page.getByText(total)).toBeVisible({ timeout: 10000 });
  }

  async assertCancelButtonVisible() {
    await expect(this.cancelOrderBtn).toBeVisible();
  }

  async assertCancelButtonNotVisible() {
    await expect(this.cancelOrderBtn).not.toBeVisible();
  }

  async openCancelDialog() {
    await this.cancelOrderBtn.click();
  }

  async confirmCancel() {
    await this.confirmCancelBtn.click();
  }
}
