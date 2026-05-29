import { test, expect } from '@playwright/test';
import { ProductListingPage } from '../pages/ProductListingPage';
import { expectPricesAscending, expectPricesDescending } from '../utils/assertions';
import { mockCatalogAPIs } from '../utils/apiMocks';
import { skipIfCatalogE2EDisabled } from '../utils/testData';

test.describe('Catalog Sorting Regression', () => {
  test.skip(skipIfCatalogE2EDisabled(), 'Enable with CATALOG_E2E=1 after catalog UI data-testid contract is implemented.');

  test.beforeEach(async ({ page }) => {
    await mockCatalogAPIs(page);
  });

  test('sort dropdown updates listing order and URL', async ({ page }) => {
    const listing = new ProductListingPage(page);

    await listing.goto();
    await listing.sortBy('price_asc');
    await expect(page).toHaveURL(/[?&]sort=price_asc/);
    await expectPricesAscending(await listing.visiblePrices());

    await listing.sortBy('price_desc');
    await expect(page).toHaveURL(/[?&]sort=price_desc/);
    await expectPricesDescending(await listing.visiblePrices());

    await listing.sortBy('name_asc');
    await expect(page).toHaveURL(/[?&]sort=name_asc/);
  });

  test('sort order persists after page refresh', async ({ page }) => {
    const listing = new ProductListingPage(page);

    await listing.goto('?sort=price_asc');
    await page.reload();
    await expect(page).toHaveURL(/[?&]sort=price_asc/);
    await expectPricesAscending(await listing.visiblePrices());
  });
});
