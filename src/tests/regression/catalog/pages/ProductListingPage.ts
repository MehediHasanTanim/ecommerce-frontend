import { expect, Page } from '@playwright/test';

export class ProductListingPage {
  constructor(private readonly page: Page) {}

  async goto(query = '') {
    await this.page.goto(`/products${query}`);
  }

  get grid() {
    return this.page.getByTestId('product-grid');
  }

  get loadingState() {
    return this.page.getByTestId('product-loading-state');
  }

  get emptyState() {
    return this.page.getByTestId('product-empty-state');
  }

  get nextPageButton() {
    return this.page.getByTestId('pagination-next');
  }

  get sortSelect() {
    return this.page.getByTestId('product-sort-select');
  }

  productCard(name: string) {
    return this.page.getByTestId('product-card').filter({ hasText: name });
  }

  productCards() {
    return this.page.getByTestId('product-card');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/products/);
    await expect(this.grid).toBeVisible();
    await expect(this.loadingState).toHaveCount(0);
  }

  async sortBy(value: string) {
    await this.sortSelect.selectOption(value);
  }

  async visiblePrices() {
    const values = await this.page.getByTestId('product-card-effective-price').allTextContents();
    return values.map((value) => Number(value.replace(/[^0-9.]/g, '')));
  }
}
