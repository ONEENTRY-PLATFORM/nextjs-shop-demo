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

    // The favorites toggle renders on EVERY product page, so it must be present.
    // It reveals via GSAP autoAlpha — wait for visibility, don't probe instantly.
    const addToFavoritesButton = page
      .locator(SELECTORS.addToFavoritesButton)
      .first();
    await expect(addToFavoritesButton).toBeVisible({ timeout: 10000 });

    // Get initial favorites count using helper
    const initialCount = await getFavoritesItemCount(page);

    // Add to favorites
    await addToFavoritesButton.click();

    // Wait for Redux store update and badge to reflect new count
    const badge = getFavoritesBadge(page);
    await expect(badge).toHaveText(String(initialCount + 1), {
      timeout: 5000,
    });
  });

  test('should remove product from favorites', async ({ page }) => {
    // Navigate to a product
    await goToFirstProduct(page);

    // The favorites toggle renders on every product page — assert it is present.
    const addToFavoritesButton = page
      .locator(SELECTORS.addToFavoritesButton)
      .first();
    await expect(addToFavoritesButton).toBeVisible({ timeout: 10000 });

    const initialCount = await getFavoritesItemCount(page);
    const badge = getFavoritesBadge(page);

    // Add to favorites — badge reflects the increment.
    await addToFavoritesButton.click();
    await expect(badge).toHaveText(String(initialCount + 1), { timeout: 5000 });

    // Toggle again to remove — badge settles back to the original count.
    await addToFavoritesButton.click();
    await expect(badge).toHaveText(String(initialCount), { timeout: 5000 });

    // The button aria-label also flips back to the "add" state after removal.
    await expect(addToFavoritesButton).toHaveAttribute(
      'aria-label',
      'Add to favorites',
    );
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
      // Empty state (EmptyFavorites) fades in via GSAP autoAlpha, so an instant
      // isVisible() check races the animation — wait for the message instead.
      const emptyMessage = page
        .getByText(/no favorites|empty|no items/i)
        .first();
      await expect(emptyMessage).toBeVisible({ timeout: 8000 });
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
    await expect(addToFavoritesButton).toBeVisible({ timeout: 10000 });

    // Get initial count and add to favorites
    const initialCount = await getFavoritesItemCount(page);
    await addToFavoritesButton.click();

    // Wait for badge to update
    const badge = getFavoritesBadge(page);
    await expect(badge).toHaveText(String(initialCount + 1), {
      timeout: 5000,
    });

    const countBefore = await getFavoritesItemCount(page);

    // Wait for redux-persist to flush the new state to localStorage
    await page.waitForTimeout(1000);

    // Reload page
    await page.reload();
    await waitForPageLoad(page);

    // After rehydration the badge briefly renders its empty state before Redux
    // restores from localStorage — wait for it to settle back to the persisted
    // count instead of reading during the transient 0 window.
    await expect(getFavoritesBadge(page)).toHaveText(String(countBefore), {
      timeout: 8000,
    });

    // Verify count persisted
    const countAfter = await getFavoritesItemCount(page);
    expect(countAfter).toBe(countBefore);
  });

  test('should add favorite to cart from favorites page', async ({ page }) => {
    // SEED from the shop so the favorites page is guaranteed non-empty AND holds a
    // genuinely purchasable product. NB: goToFirstProduct can land on a product
    // that is status=in_stock but units_product=0 (e.g. id 49 — see mismatch-log
    // B.5), which renders "Out of stock" with NO add-to-cart button. So select a
    // card that ACTUALLY renders the add-to-cart button — filtering by that button
    // is what proves real stock — and favorite THAT product.
    await page.goto('/en/shop');
    await waitForPageLoad(page);

    const inStockCard = page
      .locator(SELECTORS.productCard)
      .filter({ has: page.locator(SELECTORS.addToCartButton) })
      .first();
    await expect(inStockCard).toBeVisible({ timeout: 20000 });

    const initialFavCount = await getFavoritesItemCount(page);
    await inStockCard.locator(SELECTORS.addToFavoritesButton).click();
    await expect(getFavoritesBadge(page)).toHaveText(
      String(initialFavCount + 1),
      { timeout: 5000 },
    );

    // Give redux-persist time to flush to localStorage before the full navigation
    // (page.goto reboots the app, which rehydrates favorites from localStorage).
    await page.waitForTimeout(1000);

    // Navigate to favorites
    await page.goto('/en/favorites');
    await waitForPageLoad(page);
    await expect(page).toHaveURL(/\/favorites/);

    // The seeded (in-stock) favorite must render its add-to-cart button. Filtering
    // by the button also skips the skeleton loader, which shares .product-card but
    // renders no button.
    const favoriteCard = page
      .locator(SELECTORS.productCard)
      .filter({ has: page.locator(SELECTORS.addToCartButton) })
      .first();
    const addToCartButton = favoriteCard
      .locator(SELECTORS.addToCartButton)
      .first();
    await expect(addToCartButton).toBeVisible({ timeout: 15000 });

    // Get cart count before using helper
    const cartCountBefore = await getCartItemCount(page);

    // Add to cart
    await addToCartButton.click();

    // Wait for cart badge to update
    const cartBadge = getCartBadge(page);
    await expect(cartBadge).toHaveText(String(cartCountBefore + 1), {
      timeout: 5000,
    });
  });
});
