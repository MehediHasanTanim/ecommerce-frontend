import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { mockCatalogAPIs } from '../utils/apiMocks';
import { expectProductCardData } from '../utils/assertions';
import { skipIfCatalogE2EDisabled } from '../utils/testData';

test.describe('Catalog Homepage Regression', () => {
  test.skip(skipIfCatalogE2EDisabled(), 'Enable with CATALOG_E2E=1 after catalog UI data-testid contract is implemented.');

  test.beforeEach(async ({ page }) => {
    await mockCatalogAPIs(page);
  });

  test('homepage product sections render', async ({ page }) => {
    const home = new HomePage(page);

    await home.goto();
    await home.expectLoaded();
    await expect(home.brandsSection).toBeVisible();
    await expectProductCardData(home.productCard('Pro Laptop 15'), 'Pro Laptop 15');
  });
});
