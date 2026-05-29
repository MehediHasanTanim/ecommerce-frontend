import { test, expect } from '@playwright/test';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { mockCatalogAPIs } from '../utils/apiMocks';
import { skipIfCatalogE2EDisabled } from '../utils/testData';

test.describe('Catalog Search Regression', () => {
  test.skip(skipIfCatalogE2EDisabled(), 'Enable with CATALOG_E2E=1 after catalog UI data-testid contract is implemented.');

  test.beforeEach(async ({ page }) => {
    await mockCatalogAPIs(page);
  });

  test('search results page updates after search', async ({ page }) => {
    const search = new SearchResultsPage(page);

    await search.goto();
    await search.search('Laptop');
    await search.expectQuery('Laptop');
    await expect(search.productCard('Pro Laptop 15')).toBeVisible();
  });

  test('search input preserves searched value from URL', async ({ page }) => {
    const search = new SearchResultsPage(page);

    await search.goto('?q=Mouse');
    await expect(search.input).toHaveValue('Mouse');
    await expect(search.productCard('Wireless Mouse')).toBeVisible();
  });
});
