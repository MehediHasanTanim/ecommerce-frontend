import { Page } from '@playwright/test';

export async function mockAuthAPIs(page: Page) {
  await page.route('**/api/v1/auth/register/**', async (route) => {
    console.log(`MOCK: Register ${route.request().method()}`);
    const body = route.request().postDataJSON();
    if (body.email === 'existing@example.com') {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ email: ['Email already exists'] }),
      });
    } else {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { id: 'new-id', email: body.email, full_name: body.full_name, role: 'customer' },
          access: 'mock-access-token',
          refresh: 'mock-refresh-token',
        }),
      });
    }
  });

  await page.route('**/api/v1/auth/login/**', async (route) => {
    console.log(`MOCK: Login ${route.request().method()}`);
    const body = route.request().postDataJSON();
    if (body.password === 'wrongpass') {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ detail: 'Invalid credentials' }),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { id: 'test-id', email: body.username, full_name: 'Test User', role: 'customer' },
          access: 'mock-access-token',
          refresh: 'mock-refresh-token',
        }),
      });
    }
  });

  await page.route('**/api/v1/auth/forgot-password/**', async (route) => {
    console.log(`MOCK: Forgot Password`);
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ detail: 'Password reset link sent' }),
    });
  });
}

export async function mockUserAPIs(page: Page, userData: any, addresses: any[]) {
  // Profile (me) endpoint
  await page.route('**/api/v1/users/me/**', async (route) => {
    console.log(`MOCK: Me ${route.request().method()}`);
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(userData),
      });
    } else if (route.request().method() === 'PATCH') {
      const body = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ...userData, ...body }),
      });
    }
  });

  // Addresses endpoint
  await page.route('**/api/v1/users/addresses/**', async (route) => {
    console.log(`MOCK: Addresses ${route.request().method()}`);
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(addresses),
      });
    } else if (route.request().method() === 'POST') {
      const body = route.request().postDataJSON();
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ ...body, id: 'new-addr-id' }),
      });
    } else if (route.request().method() === 'PATCH' || route.request().method() === 'DELETE') {
      await route.fulfill({ status: 204 });
    }
  });
}
