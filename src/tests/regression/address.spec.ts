import { test, expect } from '@playwright/test';
import { testUser } from '../fixtures/users';
import { setAuthStorage } from '../support/auth-helpers';
import { mockUserAPIs } from '../support/api-mocks';
import { mockAddresses, newAddress } from '../fixtures/addresses';

test.describe('Address Management Regression', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        console.log(`BROWSER ${msg.type().toUpperCase()}: ${msg.text()}`);
      }
    });
    await setAuthStorage(page, { access: 'token', refresh: 'token' }, testUser);
    await mockUserAPIs(page, testUser, mockAddresses);
    
    // Mock delete and default actions
    await page.route('**/api/v1/users/addresses/*/', async (route) => {
      await route.fulfill({ status: 204 });
    });
    await page.route('**/api/v1/users/addresses/*/default/', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ ...mockAddresses[1], is_default: true }) });
    });
  });

  test('should display address list and add new address', async ({ page }) => {
    await page.goto('/profile/addresses');
    
    // Wait for address list to load
    await expect(page.getByText(mockAddresses[0].name)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(mockAddresses[1].name)).toBeVisible();

    await page.getByRole('button', { name: /Add New Address/i }).click();
    
    await page.getByLabel(/Label/i).fill(newAddress.name);
    await page.getByLabel(/Phone Number/i).fill(newAddress.phone);
    await page.getByLabel(/Address Line/i).fill(newAddress.address_line);
    await page.getByLabel(/Area/i).fill(newAddress.area);
    await page.getByLabel(/City/i).fill(newAddress.city);
    await page.getByLabel(/Postal Code/i).fill(newAddress.postal_code);
    await page.getByLabel(/Country/i).fill(newAddress.country);
    
    await page.getByRole('button', { name: /Save Address/i }).click();
    
    await expect(page.getByText(/Address added successfully/i)).toBeVisible();
  });

  test('should allow setting an address as default', async ({ page }) => {
    await page.goto('/profile/addresses');
    await expect(page.getByText(mockAddresses[1].name)).toBeVisible({ timeout: 10000 });
    
    await page.getByRole('button', { name: /Set Default/i }).first().click();
    
    await expect(page.getByText(/Default address updated/i)).toBeVisible();
  });

  test('should allow deleting an address', async ({ page }) => {
    await page.goto('/profile/addresses');
    await expect(page.getByText(mockAddresses[0].name)).toBeVisible({ timeout: 10000 });
    
    page.on('dialog', dialog => dialog.accept());
    
    await page.getByRole('button', { name: /Delete/i }).first().click();
    
    await expect(page.getByText(/Address deleted successfully/i)).toBeVisible();
  });
});
