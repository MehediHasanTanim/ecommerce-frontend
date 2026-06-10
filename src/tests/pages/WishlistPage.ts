import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Wishlist Page (/wishlist).
 */
export class WishlistPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly items: Locator;
  readonly emptyState: Locator;
  readonly browseProductsBtn: Locator;
  readonly errorState: Locator;
  readonly loadingSkeleton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /my wishlist/i });
    this.items = page.locator('[data-testid^="wishlist-item-"]');
    this.emptyState = page.getByTestId('wishlist-empty-state');
    this.browseProductsBtn = page.getByRole('button', { name: /browse products/i });
    this.errorState = page.getByTestId('wishlist-error-state');
    this.loadingSkeleton = page.getByTestId('wishlist-skeleton');
  }

  async goto() {
    await this.page.goto('/wishlist');
    await this.page.waitForLoadState('networkidle');
  }

  async getItemCount(): Promise<number> {
    return await this.items.count();
  }

  async getItemByName(name: string): Promise<Locator> {
    return this.items.filter({ hasText: name });
  }

  async moveToCart(name: string) {
    const item = await this.getItemByName(name);
    await item.getByRole('button', { name: new RegExp(`move ${name} to cart`, 'i') }).click();
  }

  async removeFromWishlist(name: string) {
    const item = await this.getItemByName(name);
    await item.getByRole('button', { name: new RegExp(`remove ${name} from wishlist`, 'i') }).click();
  }

  async assertEmpty() {
    await expect(this.emptyState).toBeVisible();
    await expect(this.page.getByText(/no items in wishlist/i)).toBeVisible();
  }

  async assertItemVisible(name: string) {
    const item = await this.getItemByName(name);
    await expect(item).toBeVisible();
  }

  async assertItemNotVisible(name: string) {
    await expect(this.page.getByText(name)).not.toBeVisible();
  }

  async assertError() {
    await expect(this.errorState).toBeVisible();
    await expect(this.page.getByText(/failed to load wishlist/i)).toBeVisible();
  }
}
