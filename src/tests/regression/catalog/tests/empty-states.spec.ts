import { test, expect } from '@playwright/test';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { mockCatalogAPIs } from '../utils/apiMocks';
import { skipIfCatalogE2EDisabled } from '../utils/testData';

test.describe('Catalog Empty States Regression', () => {
  test.skip(skipIfCatalogE2EDisabled(), 'Enable with CATALOG_E2E=1 after catalog UI data-testid contract is implemented.');

  test.beforeEach(async ({ page }) => {
    await mockCatalogAPIs(page);
  });

  test('empty search result state renders', async ({ page }) => {
    const search = new SearchResultsPage(page);

    await search.goto('?q=no-matching-product');
    await expect(search.emptyState).toBeVisible();
    await expect(search.grid.getByTestId('product-card')).toHaveCount(0);
    await page.getByTestId('clear-search').click();
    await expect(page).toHaveURL(/\/products|\/search\?*$/);
  });
});
