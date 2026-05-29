import { test, expect } from '@playwright/test';
import { CategoryPage } from '../pages/CategoryPage';
import { HomePage } from '../pages/HomePage';
import { mockCatalogAPIs } from '../utils/apiMocks';
import { skipIfCatalogE2EDisabled } from '../utils/testData';

test.describe('Category Navigation Regression', () => {
  test.skip(skipIfCatalogE2EDisabled(), 'Enable with CATALOG_E2E=1 after catalog UI data-testid contract is implemented.');

  test.beforeEach(async ({ page }) => {
    await mockCatalogAPIs(page);
  });

  test('homepage category link opens category page with matching products', async ({ page }) => {
    const home = new HomePage(page);
    const category = new CategoryPage(page);

    await home.goto();
    await home.categoryLink('electronics').click();
    await expect(page).toHaveURL(/\/categories\/electronics/);
    await category.expectCategory('Electronics');
    await expect(category.productCard('Pro Laptop 15')).toBeVisible();
  });

  test('empty category state renders', async ({ page }) => {
    const category = new CategoryPage(page);

    await category.goto('empty-category');
    await category.expectCategory('Empty Category');
    await expect(category.emptyState).toBeVisible();
  });

  test('category product opens product detail page', async ({ page }) => {
    const category = new CategoryPage(page);

    await category.goto('electronics');
    await category.productCard('Wireless Mouse').click();
    await expect(page).toHaveURL(/\/products\/wireless-mouse/);
  });
});
