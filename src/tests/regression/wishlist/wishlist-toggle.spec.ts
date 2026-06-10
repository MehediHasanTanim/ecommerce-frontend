/**
 * WISH-FE-REG-001: Wishlist toggle updates UI
 *
 * Scenario: User toggles wishlist items (add/remove)
 * Expected: UI updates instantly, state synchronized
 */
import { test, expect } from '@playwright/test';
import { mockAllStoreAPIs } from '../../support/cart-wishlist-mocks';
import { WishlistPage } from '../../pages/WishlistPage';
import { setAuthStorage } from '../../support/auth-helpers';
import { testUser } from '../../fixtures/users';

test.describe('WISH-FE-REG-001: Wishlist Toggle Updates UI', () => {
  test.beforeEach(async ({ page }) => {
    await setAuthStorage(page, { access: 'test-token', refresh: 'test-refresh' }, testUser);
    await mockAllStoreAPIs(page, { wishlistEmpty: false });
  });

  test('wishlist page shows wishlisted items', async ({ page }) => {
    const wishlistPage = new WishlistPage(page);

    await wishlistPage.goto();

    await expect(wishlistPage.heading).toBeVisible();
    await wishlistPage.assertItemVisible('iPhone 16 Pro');
  });

  test('wishlist shows item count in heading', async ({ page }) => {
    const wishlistPage = new WishlistPage(page);

    await wishlistPage.goto();

    await expect(wishlistPage.heading).toContainText('1 item');
  });

  test('Move to Cart button is visible on wishlist items', async ({ page }) => {
    const wishlistPage = new WishlistPage(page);

    await wishlistPage.goto();

    const moveBtn = page.getByRole('button', { name: /move iphone 16 pro to cart/i });
    await expect(moveBtn).toBeVisible();
  });

  test('Remove button is visible on wishlist items', async ({ page }) => {
    const wishlistPage = new WishlistPage(page);

    await wishlistPage.goto();

    const removeBtn = page.getByRole('button', { name: /remove iphone 16 pro from wishlist/i });
    await expect(removeBtn).toBeVisible();
  });

  test('clicking Remove removes item from wishlist', async ({ page }) => {
    const wishlistPage = new WishlistPage(page);

    await wishlistPage.goto();

    await wishlistPage.removeFromWishlist('iPhone 16 Pro');

    // After removal, the page should re-render (mock returns empty after delete + refetch)
    // The item should disappear
    await expect(page.getByText('iPhone 16 Pro')).not.toBeVisible();
  });

  test('empty wishlist shows appropriate message', async ({ page }) => {
    // Override mock to return empty wishlist
    await mockAllStoreAPIs(page, { wishlistEmpty: true });
    const wishlistPage = new WishlistPage(page);

    await wishlistPage.goto();

    await wishlistPage.assertEmpty();
    await expect(page.getByText(/no items in wishlist/i)).toBeVisible();
    await expect(wishlistPage.browseProductsBtn).toBeVisible();
  });

  test('wishlist shows In Stock badge for available items', async ({ page }) => {
    const wishlistPage = new WishlistPage(page);

    await wishlistPage.goto();

    await expect(page.getByText('In Stock')).toBeVisible();
  });

  test('in-stock item has enabled Move to Cart button', async ({ page }) => {
    const wishlistPage = new WishlistPage(page);

    await wishlistPage.goto();

    const moveBtn = page.getByRole('button', { name: /move iphone 16 pro to cart/i });
    await expect(moveBtn).not.toBeDisabled();
  });
});
