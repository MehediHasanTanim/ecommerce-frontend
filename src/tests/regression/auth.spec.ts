import { test, expect } from '@playwright/test';
import { testUser, duplicateUser } from '../fixtures/users';
import { mockAuthAPIs } from '../support/api-mocks';

test.describe('Authentication Regression', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        console.log(`BROWSER ${msg.type().toUpperCase()}: ${msg.text()}`);
      }
    });
    page.on('request', request => {
      console.log(`REQUEST: ${request.method()} ${request.url()}`);
    });
    await mockAuthAPIs(page);
  });

  test('should complete successful signup flow', async ({ page }) => {
    await page.goto('/register');
    await page.getByLabel(/Full Name/i).fill(testUser.full_name);
    await page.getByLabel(/Email Address/i).fill('new@example.com');
    await page.getByLabel(/Phone Number/i).fill(testUser.phone);
    await page.getByLabel(/^Password$/i).fill(testUser.password);
    await page.getByLabel(/Confirm Password/i).fill(testUser.password);
    
    await page.getByRole('button', { name: /Register/i }).click();
    
    await expect(page).toHaveURL('/');
    await expect(page.getByText(/Registration successful/i)).toBeVisible();
  });

  test('should display duplicate email error', async ({ page }) => {
    await page.goto('/register');
    await page.getByLabel(/Full Name/i).fill(duplicateUser.full_name);
    await page.getByLabel(/Email Address/i).fill(duplicateUser.email);
    await page.getByLabel(/Phone Number/i).fill(duplicateUser.phone);
    await page.getByLabel(/^Password$/i).fill(duplicateUser.password);
    await page.getByLabel(/Confirm Password/i).fill(duplicateUser.password);
    
    await page.getByRole('button', { name: /Register/i }).click();
    
    await expect(page.getByText(/Email already exists/i)).toBeVisible();
    await expect(page).toHaveURL('/register');
  });

  test('should complete successful login flow', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/Email or Phone/i).fill(testUser.email);
    await page.locator('#password').fill(testUser.password);
    
    await page.getByRole('button', { name: /Login/i }).click();
    
    await expect(page).toHaveURL('/');
  });

  test('should display generic error for invalid login', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.getByLabel(/Email or Phone/i).fill(testUser.email);
    await page.locator('#password').fill('wrongpass');
    
    await page.waitForTimeout(500);
    
    // Use a more specific selector for the login button in the form
    const loginButton = page.locator('main button:has-text("Login")');
    await loginButton.click({ force: true });
    
    await expect(page.getByText(/Invalid/i)).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL('/login');
  });

  test('should submit forgot password request successfully', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.getByLabel(/Email or Phone/i).fill(testUser.email);
    await page.getByRole('button', { name: /Send Reset Link/i }).click();
    
    await expect(page.getByText(/If an account exists/i)).toBeVisible();
  });

  test('should validate password mismatch on reset password', async ({ page }) => {
    await page.goto('/reset-password?token=valid-token');
    await page.getByLabel(/^New Password$/i).fill('newpassword123');
    await page.getByLabel(/^Confirm New Password$/i).fill('mismatch');
    
    await page.getByRole('button', { name: /Reset Password/i }).click();
    
    await expect(page.getByText(/Passwords don't match/i)).toBeVisible();
  });
});
