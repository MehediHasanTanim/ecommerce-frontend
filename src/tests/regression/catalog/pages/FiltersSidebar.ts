import { Page } from '@playwright/test';

export class FiltersSidebar {
  constructor(private readonly page: Page) {}

  get mobileOpenButton() {
    return this.page.getByTestId('filters-mobile-open');
  }

  get clearButton() {
    return this.page.getByTestId('filters-clear-all');
  }

  category(slug: string) {
    return this.page.getByTestId(`filter-category-${slug}`);
  }

  brand(slug: string) {
    return this.page.getByTestId(`filter-brand-${slug}`);
  }

  get minPrice() {
    return this.page.getByTestId('filter-min-price');
  }

  get maxPrice() {
    return this.page.getByTestId('filter-max-price');
  }

  availability(value: string) {
    return this.page.getByTestId(`filter-availability-${value}`);
  }

  async applyCategory(slug: string) {
    await this.category(slug).check();
  }

  async applyBrand(slug: string) {
    await this.brand(slug).check();
  }

  async applyPriceRange(min: string, max: string) {
    await this.minPrice.fill(min);
    await this.maxPrice.fill(max);
  }

  async applyAvailability(value: string) {
    await this.availability(value).check();
  }
}
