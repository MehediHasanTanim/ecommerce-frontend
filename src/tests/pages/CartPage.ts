import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Cart Page (/cart).
 */
export class CartPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly continueShoppingBtn: Locator;
  readonly cartItems: Locator;
  readonly emptyState: Locator;
  readonly orderSummary: Locator;
  readonly subtotalText: Locator;
  readonly totalText: Locator;
  readonly checkoutBtn: Locator;
  readonly couponInput: Locator;
  readonly couponApplyBtn: Locator;
  readonly loadingSkeleton: Locator;
  readonly errorState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /shopping cart/i });
    this.continueShoppingBtn = page.getByTestId('cart-empty-state').getByRole('button', { name: /continue shopping/i });
    this.cartItems = page.locator('[data-testid^="cart-item-"]');
    this.emptyState = page.getByTestId('cart-empty-state');
    this.orderSummary = page.getByText('Order Summary');
    this.subtotalText = page.getByText(/Subtotal/);
    this.totalText = page.getByText(/^Total$/);
    this.checkoutBtn = page.getByRole('button', { name: /proceed to checkout/i });
    this.couponInput = page.getByPlaceholder('Coupon code');
    this.couponApplyBtn = page.getByRole('button', { name: /apply/i });
    this.loadingSkeleton = page.getByTestId('cart-skeleton');
    this.errorState = page.getByTestId('cart-error-state');
  }

  async goto() {
    await this.page.goto('/cart');
    await this.page.waitForLoadState('networkidle');
  }

  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getItemByName(name: string): Promise<Locator> {
    return this.page.locator(`[data-testid^="cart-item-"]`).filter({ hasText: name });
  }

  async getQuantityForItem(name: string): Promise<string> {
    const item = await this.getItemByName(name);
    return (await item.locator('[aria-live="polite"]').textContent()) ?? '0';
  }

  async increaseQuantity(name: string) {
    const item = await this.getItemByName(name);
    await item.getByRole('button', { name: /increase quantity/i }).click();
  }

  async decreaseQuantity(name: string) {
    const item = await this.getItemByName(name);
    await item.getByRole('button', { name: /decrease quantity/i }).click();
  }

  async removeItem(name: string) {
    const item = await this.getItemByName(name);
    await item.getByRole('button', { name: new RegExp(`remove ${name} from cart`, 'i') }).click();
  }

  async getSubtotal(): Promise<string> {
    return (await this.subtotalText.textContent()) ?? '';
  }

  async applyCoupon(code: string) {
    await this.couponInput.fill(code);
    await this.couponApplyBtn.click();
  }

  async assertEmpty() {
    await expect(this.emptyState).toBeVisible();
    await expect(this.page.getByText(/your cart is empty/i)).toBeVisible();
  }

  async assertItemVisible(name: string) {
    const item = await this.getItemByName(name);
    await expect(item).toBeVisible();
  }

  async assertItemNotVisible(name: string) {
    await expect(this.page.getByText(name)).not.toBeVisible();
  }

  async assertTotals(subtotal: string, total: string) {
    await expect(this.subtotalText).toContainText(subtotal);
    await expect(this.totalText.locator('..').locator('..')).toContainText(total);
  }
}
