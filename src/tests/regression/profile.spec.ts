import { test, expect } from '@playwright/test';
import { testUser } from '../fixtures/users';
import { setAuthStorage } from '../support/auth-helpers';
import { mockUserAPIs } from '../support/api-mocks';
import { mockAddresses } from '../fixtures/addresses';

test.describe('Profile Regression', () => {
  test.beforeEach(async ({ page }) => {
    await setAuthStorage(page, { access: 'token', refresh: 'token' }, testUser);
    await mockUserAPIs(page, testUser, mockAddresses);
  });

  test('should render profile data and allow editing', async ({ page }) => {
    await page.goto('/profile');
    
    await expect(page.getByLabel(/Full Name/i)).toHaveValue(testUser.full_name, { timeout: 10000 });
    await expect(page.getByLabel(/Phone Number/i)).toHaveValue(testUser.phone);
    await expect(page.getByLabel(/Email Address/i)).toBeDisabled();

    await page.getByLabel(/Full Name/i).fill('Updated Name');
    await page.getByRole('button', { name: /Update Profile/i }).click();
    
    await expect(page.getByText(/Profile updated successfully/i)).toBeVisible();
    await expect(page.getByLabel(/Full Name/i)).toHaveValue('Updated Name');
  });
});
