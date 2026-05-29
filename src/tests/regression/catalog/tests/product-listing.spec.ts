import { test, expect } from '@playwright/test';
import { ProductListingPage } from '../pages/ProductListingPage';
import { mockCatalogAPIs } from '../utils/apiMocks';
import { expectProductCardData } from '../utils/assertions';
import { skipIfCatalogE2EDisabled } from '../utils/testData';

test.describe('Product Listing Regression', () => {
  test.skip(skipIfCatalogE2EDisabled(), 'Enable with CATALOG_E2E=1 after catalog UI data-testid contract is implemented.');

  test.beforeEach(async ({ page }) => {
    await mockCatalogAPIs(page);
  });

  test('product listing page loads active products', async ({ page }) => {
    const listing = new ProductListingPage(page);

    await listing.goto();
    await listing.expectLoaded();
    await expectProductCardData(listing.productCard('Pro Laptop 15'), 'Pro Laptop 15');
    await expect(listing.productCard('Old Phone')).toHaveCount(0);
  });

  test('pagination advances to next result set when available', async ({ page }) => {
    const listing = new ProductListingPage(page);

    await listing.goto('?limit=2');
    await listing.expectLoaded();
    await expect(listing.productCards()).toHaveCount(2);
    await listing.nextPageButton.click();
    await expect(page).toHaveURL(/[?&]page=2/);
  });
});
