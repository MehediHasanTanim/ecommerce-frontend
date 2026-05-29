import { test, expect } from '@playwright/test';
import { FiltersSidebar } from '../pages/FiltersSidebar';
import { ProductListingPage } from '../pages/ProductListingPage';
import { mockCatalogAPIs } from '../utils/apiMocks';
import { skipIfCatalogE2EDisabled } from '../utils/testData';

test.describe('Catalog Filters Regression', () => {
  test.skip(skipIfCatalogE2EDisabled(), 'Enable with CATALOG_E2E=1 after catalog UI data-testid contract is implemented.');

  test.beforeEach(async ({ page }) => {
    await mockCatalogAPIs(page);
  });

  test('filter sidebar changes visible results and syncs URL', async ({ page }) => {
    const listing = new ProductListingPage(page);
    const filters = new FiltersSidebar(page);

    await listing.goto();
    await filters.applyCategory('electronics');
    await expect(page).toHaveURL(/[?&]category=electronics/);
    await expect(listing.productCard('Cotton Shirt')).toHaveCount(0);

    await filters.applyBrand('techpro');
    await expect(page).toHaveURL(/[?&]brand=techpro/);

    await filters.applyPriceRange('40', '1200');
    await expect(page).toHaveURL(/[?&]minPrice=40/);
    await expect(page).toHaveURL(/[?&]maxPrice=1200/);

    await filters.applyAvailability('LOW_STOCK');
    await expect(page).toHaveURL(/[?&]availability=LOW_STOCK/);
    await expect(listing.productCard('Wireless Mouse')).toBeVisible();
  });

  test('clear all filters resets results', async ({ page }) => {
    const listing = new ProductListingPage(page);
    const filters = new FiltersSidebar(page);

    await listing.goto('?category=electronics&brand=techpro');
    await filters.clearButton.click();
    await expect(page).not.toHaveURL(/category=electronics/);
    await expect(listing.productCard('Cotton Shirt')).toBeVisible();
  });

  test('mobile filter drawer opens and applies filters', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const listing = new ProductListingPage(page);
    const filters = new FiltersSidebar(page);

    await listing.goto();
    await filters.mobileOpenButton.click();
    await filters.applyCategory('clothing');
    await expect(page).toHaveURL(/[?&]category=clothing/);
    await expect(listing.productCard('Cotton Shirt')).toBeVisible();
  });
});
