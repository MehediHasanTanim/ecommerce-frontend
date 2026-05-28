import { test, expect } from '@playwright/test';
import { clearAuthStorage } from '../support/auth-helpers';

test.describe('Protected Routes Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearAuthStorage(page);
  });

  test('should redirect guest from profile page to login', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL(/\/login\?redirect=.*profile/);
  });

  test('should redirect guest from addresses page to login', async ({ page }) => {
    await page.goto('/profile/addresses');
    await expect(page).toHaveURL(/\/login\?redirect=.*profile.*addresses/);
  });
});
