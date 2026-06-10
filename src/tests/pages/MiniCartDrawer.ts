import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Mini Cart Drawer.
 */
export class MiniCartDrawer {
  readonly page: Page;
  readonly cartIcon: Locator;
  readonly drawer: Locator;
  readonly drawerHeading: Locator;
  readonly closeBtn: Locator;
  readonly viewCartBtn: Locator;
  readonly checkoutBtn: Locator;
  readonly emptyMessage: Locator;
  readonly cartItems: Locator;
  readonly subtotalLabel: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartIcon = page.getByRole('button', { name: /shopping cart/i });
    this.drawer = page.getByRole('dialog', { name: /shopping cart drawer/i });
    this.drawerHeading = page.getByRole('heading', { name: /cart/i });
    this.closeBtn = page.getByRole('button', { name: /close cart drawer/i });
    this.viewCartBtn = page.getByRole('link', { name: /view cart/i });
    this.checkoutBtn = page.getByRole('link', { name: /checkout/i });
    this.emptyMessage = page.getByText(/your cart is empty/i);
    this.cartItems = page.locator('[role="dialog"] li');
    this.subtotalLabel = page.getByText(/subtotal/i);
    this.cartBadge = page.locator('header [aria-label*="cart"] span');
  }

  async open() {
    await this.cartIcon.click();
    await expect(this.drawer).toBeVisible();
  }

  async close() {
    await this.closeBtn.click();
    await expect(this.drawer).not.toBeVisible();
  }

  async closeViaEscape() {
    await this.page.keyboard.press('Escape');
    await expect(this.drawer).not.toBeVisible();
  }

  async closeViaBackdrop() {
    // Click the backdrop (sibling before the drawer)
    await this.page.locator('.fixed.inset-0.z-40').first().click();
    await expect(this.drawer).not.toBeVisible();
  }

  async assertItemVisible(name: string) {
    await expect(this.drawer.getByText(name)).toBeVisible();
  }

  async getCartBadgeCount(): Promise<string> {
    return (await this.cartBadge.textContent()) ?? '0';
  }

  async assertBadgeCount(expected: string) {
    await expect(this.cartBadge).toHaveText(expected);
  }

  async assertEmpty() {
    await expect(this.emptyMessage).toBeVisible();
  }

  async assertSubtotal(amount: string) {
    await expect(this.page.locator('[role="dialog"]').getByText(amount)).toBeVisible();
  }

  async clickViewCart() {
    await this.viewCartBtn.click();
  }

  async clickCheckout() {
    await this.checkoutBtn.click();
  }
}
