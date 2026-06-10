import { Page, expect } from '@playwright/test';

export async function loginViaUI(page: Page, user: any) {
  await page.goto('/login');
  await page.getByLabel(/Email Address|Email or Phone/i).fill(user.email);
  await page.getByLabel(/Password/i).fill(user.password);
  await page.getByRole('button', { name: /Login/i }).click();
  await expect(page).toHaveURL(/profile|$/);
}

/**
 * Set auth state in both localStorage (for persist hydration) and
 * directly in the Zustand store via page.evaluate (for immediate use).
 */
export async function setAuthStorage(page: Page, tokens: any, user: any) {
  // Pre-set localStorage so Zustand persist picks it up on hydration
  await page.addInitScript((data) => {
    window.localStorage.setItem('auth-storage', JSON.stringify({
      state: {
        user: data.user,
        accessToken: data.tokens.access,
        refreshToken: data.tokens.refresh,
        isAuthenticated: true,
        _hasHydrated: true,
      },
      version: 0,
    }));
  }, { tokens, user });
}

export async function clearAuthStorage(page: Page) {
  try {
    await page.evaluate(() => {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('auth-storage');
      }
    });
  } catch (e) {
    // Ignore security errors if localStorage is not accessible
  }
}
