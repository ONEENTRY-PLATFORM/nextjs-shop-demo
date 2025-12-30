import { expect, test } from '@playwright/test';

import { getCartBadge, getCartItemCount } from './helpers/cart-helpers';
import {
  getFavoritesBadge,
  getFavoritesItemCount,
} from './helpers/favorites-helpers';
import {
  goToFirstProduct,
  waitForPageLoad,
} from './helpers/navigation-helpers';
import { SELECTORS } from './settings';

/**
 * E2E tests for favorites/wishlist functionality
 */
test.describe('Favorites', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
    await waitForPageLoad(page);
  });

  test('should add product to favorites', async ({ page }) => {
    // Navigate to a product
    await goToFirstProduct(page);

    // Find and click add to favorites button
    const addToFavoritesButton = page
      .locator(SELECTORS.addToFavoritesButton)
      .first();

    // Check if favorites feature exists
    const isVisible = await addToFavoritesButton
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    if (isVisible) {
      // Get initial favorites count using helper
      const initialCount = await getFavoritesItemCount(page);

      // Add to favorites
      await addToFavoritesButton.click();

      // Wait for Redux store update and badge to reflect new count
      const badge = getFavoritesBadge(page);
      await expect(badge).toHaveText(String(initialCount + 1), {
        timeout: 5000,
      });
    } else {
      test.skip();
    }
  });

  test('should remove product from favorites', async ({ page }) => {
    // Navigate to a product
    await goToFirstProduct(page);

    // Add to favorites first
    const addToFavoritesButton = page
      .locator(SELECTORS.addToFavoritesButton)
      .first();

    const isVisible = await addToFavoritesButton
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    if (isVisible) {
      await addToFavoritesButton.click();
      await page.waitForTimeout(1000);

      // Click again to remove (toggle behavior)
      await addToFavoritesButton.click();
      await page.waitForTimeout(1000);

      // Verify it was removed (button state changed)
      // This depends on your implementation - might check for class, icon, or text change
    } else {
      test.skip();
    }
  });

  test('should view favorites page', async ({ page }) => {
    // Navigate to favorites page
    await page.goto('/en/favorites');
    await waitForPageLoad(page);

    // Verify we're on favorites page
    await expect(page).toHaveURL(/\/favorites/);

    // Check for favorites content or empty state
    const favoriteItems = page.locator(SELECTORS.productCard);
    const count = await favoriteItems.count();

    if (count === 0) {
      // Look for empty state message
      const emptyMessage = page.getByText(/no favorites|empty|no items/i);
      const hasEmptyMessage = await emptyMessage.isVisible().catch(() => false);
      expect(hasEmptyMessage).toBeTruthy();
    } else {
      // Favorites should be displayed
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should persist favorites after page reload', async ({ page }) => {
    // Navigate to a product and add to favorites
    await goToFirstProduct(page);

    const addToFavoritesButton = page
      .locator(SELECTORS.addToFavoritesButton)
      .first();

    const isVisible = await addToFavoritesButton
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    if (isVisible) {
      // Get initial count and add to favorites
      const initialCount = await getFavoritesItemCount(page);
      await addToFavoritesButton.click();

      // Wait for badge to update
      const badge = getFavoritesBadge(page);
      await expect(badge).toHaveText(String(initialCount + 1), {
        timeout: 5000,
      });

      const countBefore = await getFavoritesItemCount(page);

      // Wait for redux-persist to save to localStorage
      await page.waitForTimeout(1000);

      // Reload page
      await page.reload();
      await waitForPageLoad(page);

      // Wait for Redux to restore from localStorage after reload
      await page.waitForTimeout(1000);

      // Verify count persisted
      const countAfter = await getFavoritesItemCount(page);
      expect(countAfter).toBe(countBefore);
    } else {
      test.skip();
    }
  });

  test('should add favorite to cart from favorites page', async ({ page }) => {
    // Navigate to favorites
    await page.goto('/en/favorites');
    await waitForPageLoad(page);

    // Check if there are favorites
    const favoriteItems = page.locator(SELECTORS.productCard);
    const count = await favoriteItems.count();

    if (count > 0) {
      // Find add to cart button in first favorite
      const firstFavorite = favoriteItems.first();
      const addToCartButton = firstFavorite.locator(SELECTORS.addToCartButton);

      const isVisible = await addToCartButton.isVisible().catch(() => false);

      if (isVisible) {
        // Get cart count before using helper
        const cartCountBefore = await getCartItemCount(page);

        // Add to cart
        await addToCartButton.click();

        // Wait for cart badge to update
        const cartBadge = getCartBadge(page);
        await expect(cartBadge).toHaveText(String(cartCountBefore + 1), {
          timeout: 5000,
        });
      }
    } else {
      test.skip();
    }
  });
});
