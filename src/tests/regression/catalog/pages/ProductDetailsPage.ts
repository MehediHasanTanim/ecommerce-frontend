import { expect, Page } from '@playwright/test';

export class ProductDetailsPage {
  constructor(private readonly page: Page) {}

  async goto(slug: string) {
    await this.page.goto(`/products/${slug}`);
  }

  get title() {
    return this.page.getByTestId('product-detail-title');
  }

  get imageGallery() {
    return this.page.getByTestId('product-image-gallery');
  }

  get price() {
    return this.page.getByTestId('product-detail-price');
  }

  get description() {
    return this.page.getByTestId('product-detail-description');
  }

  get brand() {
    return this.page.getByTestId('product-detail-brand');
  }

  get category() {
    return this.page.getByTestId('product-detail-category');
  }

  get stockStatus() {
    return this.page.getByTestId('product-detail-stock-status');
  }

  get variants() {
    return this.page.getByTestId('product-variant-option');
  }

  get errorState() {
    return this.page.getByTestId('product-detail-error-state');
  }

  async expectProductLoaded(name: string) {
    await expect(this.title).toContainText(name);
    await expect(this.imageGallery).toBeVisible();
    await expect(this.price).toBeVisible();
    await expect(this.description).toBeVisible();
    await expect(this.stockStatus).toBeVisible();
  }
}
