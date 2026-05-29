import { test, expect } from '@playwright/test';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { ProductListingPage } from '../pages/ProductListingPage';
import { mockCatalogAPIs } from '../utils/apiMocks';
import { skipIfCatalogE2EDisabled } from '../utils/testData';

test.describe('Product Details Regression', () => {
  test.skip(skipIfCatalogE2EDisabled(), 'Enable with CATALOG_E2E=1 after catalog UI data-testid contract is implemented.');

  test.beforeEach(async ({ page }) => {
    await mockCatalogAPIs(page);
  });

  test('product detail page loads selected product from listing', async ({ page }) => {
    const listing = new ProductListingPage(page);
    const detail = new ProductDetailsPage(page);

    await listing.goto();
    await listing.productCard('Pro Laptop 15').click();
    await expect(page).toHaveURL(/\/products\/pro-laptop-15/);
    await detail.expectProductLoaded('Pro Laptop 15');
    await expect(detail.brand).toContainText('TechPro');
    await expect(detail.category).toContainText('Electronics');
    await expect(detail.variants).toHaveCount(2);
  });

  test('invalid product slug shows friendly error state', async ({ page }) => {
    const detail = new ProductDetailsPage(page);

    await detail.goto('invalid-slug');
    await expect(detail.errorState).toBeVisible();
    await expect(detail.errorState).toContainText(/not found|unavailable/i);
  });
});
