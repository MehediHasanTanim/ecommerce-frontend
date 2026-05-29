import { expect, Page } from '@playwright/test';

export class HomePage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  get promoBanner() {
    return this.page.getByTestId('home-promo-banner');
  }

  get featuredProducts() {
    return this.page.getByTestId('home-featured-products');
  }

  get categoriesSection() {
    return this.page.getByTestId('home-categories');
  }

  get brandsSection() {
    return this.page.getByTestId('home-brands');
  }

  productCard(name: string) {
    return this.page.getByTestId('product-card').filter({ hasText: name });
  }

  categoryLink(slug: string) {
    return this.page.getByTestId(`category-link-${slug}`);
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL('/');
    await expect(this.promoBanner).toBeVisible();
    await expect(this.featuredProducts).toBeVisible();
    await expect(this.categoriesSection).toBeVisible();
  }
}
