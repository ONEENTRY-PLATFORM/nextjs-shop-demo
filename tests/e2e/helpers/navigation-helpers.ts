import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { ROUTES, SELECTORS } from '../fixtures/test-data';

/**
 * Helper functions for navigation in E2E tests
 */

/**
 * Navigates to the home page
 * @param {Page} page - Playwright page object
 */
export async function goToHome(page: Page): Promise<void> {
  await page.goto(ROUTES.home);
  await expect(page).toHaveURL(ROUTES.home);
}

/**
 * Navigates to the shop page
 * @param {Page} page - Playwright page object
 */
export async function goToShop(page: Page): Promise<void> {
  await page.goto(ROUTES.shop);
  await expect(page).toHaveURL(new RegExp(ROUTES.shop));
}

/**
 * Navigates to the cart page
 * @param {Page} page - Playwright page object
 */
export async function goToCart(page: Page): Promise<void> {
  await page.goto(ROUTES.cart);
  await expect(page).toHaveURL(ROUTES.cart);
}

/**
 * Navigates to the favorites page
 * @param {Page} page - Playwright page object
 */
export async function goToFavorites(page: Page): Promise<void> {
  await page.goto(ROUTES.favorites);
  await expect(page).toHaveURL(ROUTES.favorites);
}

/**
 * Navigates to a product page
 * @param {Page}            page      - Playwright page object
 * @param {string | number} productId - Product ID
 */
export async function goToProduct(
  page: Page,
  productId: string | number,
): Promise<void> {
  const url = `/en/shop/product/${productId}`;
  await page.goto(url);
  await expect(page).toHaveURL(url);
}

/**
 * Waits for the page to be fully loaded
 * @param   {Page}          page - Playwright page object
 * @returns {Promise<void>}      Promise that resolves when the page is fully loaded
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Navigates to first available product (in stock) from shop page
 * @param   {Page}            page - Playwright page object
 * @returns {Promise<string>}      Product URL
 */
export async function goToFirstProduct(page: Page): Promise<string> {
  await goToShop(page);
  await waitForPageLoad(page);

  // Get all product cards
  const productCards = page.locator('.product-card');
  const count = await productCards.count();

  if (count === 0) {
    throw new Error('No products found on shop page');
  }

  // Try to find a product that is in stock (has Add to Cart button)
  for (let i = 0; i < count; i++) {
    const card = productCards.nth(i);

    // Check if this product has "Add to Cart" button (not "Out of Stock")
    const addToCartButton = card.locator(SELECTORS.addToCartButton);
    const hasAddToCart = await addToCartButton.isVisible().catch(() => false);

    // If not found by test ID, check if button text is not "Out of stock"
    if (!hasAddToCart) {
      // Check for Out of Stock button
      const outOfStockButton = card.getByText(/out of stock/i);
      const isOutOfStock = await outOfStockButton
        .isVisible()
        .catch(() => false);

      // Skip if out of stock
      if (isOutOfStock) {
        continue;
      }

      // Check for any button that might be "Add to Cart"
      const anyButton = card.locator('button, .btn').first();
      const buttonText = await anyButton.textContent().catch(() => '');

      // Skip if button says "Out of stock"
      if (buttonText && buttonText.toLowerCase().includes('out of stock')) {
        continue;
      }
    }

    // This product is available, click on it
    const productLink = card.locator('a[href*="/shop/product/"]');
    await productLink.click();
    await waitForPageLoad(page);

    return page.url();
  }

  // If no available product found, throw error
  throw new Error(
    'No available products (in stock) found. All products are out of stock.',
  );
}
