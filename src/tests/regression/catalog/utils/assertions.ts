import { expect, Locator } from '@playwright/test';

export async function expectProductCardData(card: Locator, productName: string) {
  await expect(card).toContainText(productName);
  await expect(card.getByTestId('product-card-image')).toBeVisible();
  await expect(card.getByTestId('product-card-price')).toBeVisible();
  await expect(card.getByTestId('product-card-availability')).toBeVisible();
}

export async function expectPricesAscending(prices: number[]) {
  expect(prices).toEqual([...prices].sort((a, b) => a - b));
}

export async function expectPricesDescending(prices: number[]) {
  expect(prices).toEqual([...prices].sort((a, b) => b - a));
}
