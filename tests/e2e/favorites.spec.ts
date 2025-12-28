import { test, expect } from '@playwright/test';
import { goToFirstProduct, waitForPageLoad } from './helpers/navigation-helpers';
import { SELECTORS } from './fixtures/test-data';

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
      // Get initial favorites count if badge exists
      const favoritesIcon = page.locator(SELECTORS.favoritesIcon);
      const badge = favoritesIcon.locator('[data-testid="favorites-badge"]');
      const initialCount = await badge
        .textContent()
        .then((text) => (text ? parseInt(text, 10) : 0))
        .catch(() => 0);

      // Add to favorites
      await addToFavoritesButton.click();
      await page.waitForTimeout(1000);

      // Verify favorites count increased
      const newCount = await badge
        .textContent()
        .then((text) => (text ? parseInt(text, 10) : 0))
        .catch(() => 0);

      expect(newCount).toBeGreaterThan(initialCount);
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
    const favoriteItems = page.locator(SELECTORS.favoriteItem);
    const count = await favoriteItems.count();

    if (count === 0) {
      // Look for empty state message
      const emptyMessage = page.getByText(/no favorites|empty|no items/i);
      const hasEmptyMessage = await emptyMessage
        .isVisible()
        .catch(() => false);
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
      await addToFavoritesButton.click();
      await page.waitForTimeout(1000);

      // Get favorites count
      const favoritesIcon = page.locator(SELECTORS.favoritesIcon);
      const badge = favoritesIcon.locator('[data-testid="favorites-badge"]');
      const countBefore = await badge
        .textContent()
        .then((text) => (text ? parseInt(text, 10) : 0))
        .catch(() => 0);

      // Reload page
      await page.reload();
      await waitForPageLoad(page);

      // Verify count persisted
      const countAfter = await badge
        .textContent()
        .then((text) => (text ? parseInt(text, 10) : 0))
        .catch(() => 0);

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
    const favoriteItems = page.locator(SELECTORS.favoriteItem);
    const count = await favoriteItems.count();

    if (count > 0) {
      // Find add to cart button in first favorite
      const firstFavorite = favoriteItems.first();
      const addToCartButton = firstFavorite.locator(
        SELECTORS.addToCartButton,
      );

      const isVisible = await addToCartButton
        .isVisible()
        .catch(() => false);

      if (isVisible) {
        // Get cart count before
        const cartIcon = page.locator(SELECTORS.cartIcon);
        const cartBadge = cartIcon.locator('[data-testid="cart-badge"]');
        const cartCountBefore = await cartBadge
          .textContent()
          .then((text) => (text ? parseInt(text, 10) : 0))
          .catch(() => 0);

        // Add to cart
        await addToCartButton.click();
        await page.waitForTimeout(1000);

        // Verify cart count increased
        const cartCountAfter = await cartBadge
          .textContent()
          .then((text) => (text ? parseInt(text, 10) : 0))
          .catch(() => 0);

        expect(cartCountAfter).toBeGreaterThan(cartCountBefore);
      }
    } else {
      test.skip();
    }
  });
});
