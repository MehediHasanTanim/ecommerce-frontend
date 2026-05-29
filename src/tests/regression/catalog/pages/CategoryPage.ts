import { expect, Page } from '@playwright/test';

export class CategoryPage {
  constructor(private readonly page: Page) {}

  async goto(slug: string) {
    await this.page.goto(`/categories/${slug}`);
  }

  get title() {
    return this.page.getByTestId('category-title');
  }

  get description() {
    return this.page.getByTestId('category-description');
  }

  get productGrid() {
    return this.page.getByTestId('product-grid');
  }

  get emptyState() {
    return this.page.getByTestId('category-empty-state');
  }

  productCard(name: string) {
    return this.page.getByTestId('product-card').filter({ hasText: name });
  }

  async expectCategory(name: string) {
    await expect(this.title).toContainText(name);
    await expect(this.description).toBeVisible();
  }
}
