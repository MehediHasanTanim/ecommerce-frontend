import { expect, Page } from '@playwright/test';

export class SearchResultsPage {
  constructor(private readonly page: Page) {}

  async goto(query = '') {
    await this.page.goto(`/search${query}`);
  }

  get input() {
    return this.page.getByTestId('catalog-search-input');
  }

  get submitButton() {
    return this.page.getByTestId('catalog-search-submit');
  }

  get grid() {
    return this.page.getByTestId('product-grid');
  }

  get emptyState() {
    return this.page.getByTestId('search-empty-state');
  }

  productCard(name: string) {
    return this.page.getByTestId('product-card').filter({ hasText: name });
  }

  async search(keyword: string) {
    await this.input.fill(keyword);
    await this.submitButton.click();
  }

  async expectQuery(keyword: string) {
    await expect(this.page).toHaveURL(new RegExp(`[?&]q=${encodeURIComponent(keyword)}`));
    await expect(this.input).toHaveValue(keyword);
  }
}
