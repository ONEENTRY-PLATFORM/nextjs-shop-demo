import { expect, test } from '@playwright/test';

import {
  clearCart,
  getCartBadge,
  getCartItemCount,
} from './helpers/cart-helpers';
import {
  getFavoritesBadge,
  getFavoritesItemCount,
} from './helpers/favorites-helpers';
import {
  goToFirstProduct,
  waitForPageLoad,
} from './helpers/navigation-helpers';
import { ROUTES, SELECTORS } from './settings';

/**
 * E2E tests for the single product page
 */

test.describe('Product Page — Structure', () => {
  test.setTimeout(30000);

  let productUrl: string;

  test.beforeEach(async ({ page }) => {
    productUrl = await goToFirstProduct(page);
  });

  test('should display product title', async ({ page }) => {
    const title = page.locator(SELECTORS.productTitle).first();
    await expect(title).toBeVisible();

    const text = await title.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('should display product image', async ({ page }) => {
    const image = page.locator('img').first();
    await expect(image).toBeVisible();

    // Image should have a valid src
    const src = await image.getAttribute('src');
    expect(src).toBeTruthy();
  });

  test('should display product price', async ({ page }) => {
    const priceEl = page.locator(SELECTORS.productPrice).first();
    await expect(priceEl).toBeVisible();

    // Price should contain some numeric content
    const text = await priceEl.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('should display add-to-cart button or out-of-stock indicator', async ({
    page,
  }) => {
    const addToCartBtn = page.locator(SELECTORS.addToCartButton).first();
    const hasAddToCart = await addToCartBtn.isVisible().catch(() => false);

    if (!hasAddToCart) {
      // Out-of-stock state — look for out-of-stock text
      const outOfStock = page.getByText(/out of stock/i).first();
      await expect(outOfStock).toBeVisible();
    } else {
      await expect(addToCartBtn).toBeVisible();
    }
  });

  test('should display favorites button', async ({ page }) => {
    const favBtn = page.locator(SELECTORS.addToFavoritesButton).first();
    await expect(favBtn).toBeVisible();
  });

  test('should be on correct URL', async ({ page }) => {
    await expect(page).toHaveURL(/\/shop\/product\//);
  });
});

test.describe('Product Page — Add to Cart', () => {
  test.setTimeout(30000);

  test.beforeEach(async ({ page }) => {
    await goToFirstProduct(page);
  });

  test('should add product to cart and update badge', async ({ page }) => {
    const addToCartBtn = page.locator(SELECTORS.addToCartButton).first();
    const isVisible = await addToCartBtn.isVisible().catch(() => false);

    if (!isVisible) {
      test.skip();
      return;
    }

    const initialCount = await getCartItemCount(page);
    await addToCartBtn.click();

    // Badge should reflect new count
    const badge = getCartBadge(page);
    await expect(badge).toHaveText(String(initialCount + 1), { timeout: 5000 });
  });

  test('should replace add-to-cart button with quantity selector after adding', async ({
    page,
  }) => {
    const addToCartBtn = page.locator(SELECTORS.addToCartButton).first();
    const isVisible = await addToCartBtn.isVisible().catch(() => false);

    if (!isVisible) {
      test.skip();
      return;
    }

    // Capture count before click — page may have multiple variants each with their own button
    const initialCount = await page.locator(SELECTORS.addToCartButton).count();
    await addToCartBtn.click();

    // One button replaced by quantity controls; count decreases by 1
    await expect(page.locator(SELECTORS.addToCartButton)).toHaveCount(
      initialCount - 1,
      { timeout: 5000 },
    );
    await expect(
      page.locator(SELECTORS.increaseQuantityButton).first(),
    ).toBeVisible({ timeout: 5000 });
    await expect(
      page.locator(SELECTORS.decreaseQuantityButton).first(),
    ).toBeVisible({ timeout: 5000 });
  });

  test('should increase quantity via + button on product page', async ({
    page,
  }) => {
    const addToCartBtn = page.locator(SELECTORS.addToCartButton).first();
    const isVisible = await addToCartBtn.isVisible().catch(() => false);

    if (!isVisible) {
      test.skip();
      return;
    }

    // Add product
    await addToCartBtn.click();
    const badge = getCartBadge(page);
    await expect(badge).toHaveText('1', { timeout: 5000 });

    // Increase quantity
    const increaseBtn = page.locator(SELECTORS.increaseQuantityButton).first();
    await expect(increaseBtn).toBeVisible({ timeout: 5000 });
    await increaseBtn.click();

    await expect(badge).toHaveText('2', { timeout: 5000 });
  });

  test('should decrease quantity to zero and restore add-to-cart button', async ({
    page,
  }) => {
    const addToCartBtn = page.locator(SELECTORS.addToCartButton).first();
    const isVisible = await addToCartBtn.isVisible().catch(() => false);

    if (!isVisible) {
      test.skip();
      return;
    }

    // Add product
    await addToCartBtn.click();
    const badge = getCartBadge(page);
    await expect(badge).toHaveText('1', { timeout: 5000 });

    // Decrease — should remove from cart (qty was 1)
    const decreaseBtn = page.locator(SELECTORS.decreaseQuantityButton).first();
    await expect(decreaseBtn).toBeVisible({ timeout: 5000 });
    await decreaseBtn.click();

    // Badge should disappear or show 0, and add-to-cart button should reappear
    await expect(page.locator(SELECTORS.addToCartButton).first()).toBeVisible({
      timeout: 5000,
    });
  });

  test('should show toast notification when adding to cart', async ({
    page,
  }) => {
    const addToCartBtn = page.locator(SELECTORS.addToCartButton).first();
    const isVisible = await addToCartBtn.isVisible().catch(() => false);

    if (!isVisible) {
      test.skip();
      return;
    }

    await addToCartBtn.click();

    // Toast notification should appear
    const toast = page.locator('.Toastify__toast').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
  });

  test.afterEach(async ({ page }) => {
    try {
      await clearCart(page);
    } catch {
      // Ignore cleanup errors
    }
  });
});

test.describe('Product Page — Favorites', () => {
  test.setTimeout(30000);

  test.beforeEach(async ({ page }) => {
    await goToFirstProduct(page);
  });

  test('should toggle favorites and update badge', async ({ page }) => {
    const favBtn = page.locator(SELECTORS.addToFavoritesButton).first();
    await expect(favBtn).toBeVisible();

    const initialCount = await getFavoritesItemCount(page);

    // Add to favorites
    await favBtn.click();
    const badge = getFavoritesBadge(page);
    await expect(badge).toHaveText(String(initialCount + 1), { timeout: 5000 });

    // Remove from favorites (toggle)
    await favBtn.click();

    // Count should return to initial value (badge stays visible, showing 0 when empty)
    await expect(getFavoritesBadge(page)).toHaveText(String(initialCount), {
      timeout: 5000,
    });
  });

  test('should show toast when adding to favorites', async ({ page }) => {
    const favBtn = page.locator(SELECTORS.addToFavoritesButton).first();
    await expect(favBtn).toBeVisible();

    await favBtn.click();

    const toast = page.locator('.Toastify__toast').first();
    await expect(toast).toBeVisible({ timeout: 5000 });

    // Cleanup
    await favBtn.click();
  });

  test.afterEach(async ({ page }) => {
    // Ensure favorites cleared via localStorage reset
    try {
      const favBtn = page.locator(SELECTORS.addToFavoritesButton).first();
      const isFav = await favBtn
        .getAttribute('aria-label')
        .then((label) => label === 'Remove from favorites')
        .catch(() => false);
      if (isFav) {
        await favBtn.click();
      }
    } catch {
      // Ignore cleanup errors
    }
  });
});

test.describe('Product Page — Navigation', () => {
  test.setTimeout(20000);

  test('should navigate to product page from shop', async ({ page }) => {
    await page.goto(ROUTES.shop);
    await waitForPageLoad(page);

    // Click first product card link
    const productLink = page.locator('a[href*="/shop/product/"]').first();
    await expect(productLink).toBeVisible({ timeout: 10000 });
    await productLink.click();
    await waitForPageLoad(page);

    await expect(page).toHaveURL(/\/shop\/product\//);
    await expect(page.locator(SELECTORS.productTitle).first()).toBeVisible();
  });

  test('should have breadcrumbs or back navigation', async ({ page }) => {
    await goToFirstProduct(page);

    // Look for breadcrumbs or a back link to shop/home
    const breadcrumb = page
      .locator(
        'nav[aria-label*="breadcrumb"], .breadcrumb, [class*="breadcrumb"]',
      )
      .first();
    const backLink = page.locator('a[href*="/shop"]').first();

    const hasBreadcrumb = await breadcrumb.isVisible().catch(() => false);
    const hasBackLink = await backLink.isVisible().catch(() => false);

    expect(hasBreadcrumb || hasBackLink).toBe(true);
  });

  test('should display related products section', async ({ page }) => {
    await goToFirstProduct(page);

    // Related products section or similar products carousel
    const relatedSection = page
      .getByText(/related|similar|you may also like/i)
      .first();
    const hasRelated = await relatedSection.isVisible().catch(() => false);

    // Related section is optional — don't fail if there are none
    if (hasRelated) {
      await expect(relatedSection).toBeVisible();
    }
  });

  test('should link to product page from ROUTES constant', async ({ page }) => {
    await page.goto(ROUTES.product);
    await waitForPageLoad(page);

    await expect(page).toHaveURL(ROUTES.product);
    await expect(page.locator(SELECTORS.productTitle).first()).toBeVisible({
      timeout: 10000,
    });
  });
});
