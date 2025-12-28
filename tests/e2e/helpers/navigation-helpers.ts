import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { ROUTES } from '../fixtures/test-data';

/**
 * Helper functions for navigation in E2E tests
 */

/**
 * Navigates to the home page
 * @param page - Playwright page object
 */
export async function goToHome(page: Page): Promise<void> {
  await page.goto(ROUTES.home);
  await expect(page).toHaveURL(ROUTES.home);
}

/**
 * Navigates to the shop page
 * @param page - Playwright page object
 */
export async function goToShop(page: Page): Promise<void> {
  await page.goto(ROUTES.shop);
  await expect(page).toHaveURL(new RegExp(ROUTES.shop));
}

/**
 * Navigates to the cart page
 * @param page - Playwright page object
 */
export async function goToCart(page: Page): Promise<void> {
  await page.goto(ROUTES.cart);
  await expect(page).toHaveURL(ROUTES.cart);
}

/**
 * Navigates to the favorites page
 * @param page - Playwright page object
 */
export async function goToFavorites(page: Page): Promise<void> {
  await page.goto(ROUTES.favorites);
  await expect(page).toHaveURL(ROUTES.favorites);
}

/**
 * Navigates to a product page
 * @param page      - Playwright page object
 * @param productId - Product ID
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
 * @param page - Playwright page object
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Navigates to first available product from shop page
 * @param page - Playwright page object
 * @returns    Product URL
 */
export async function goToFirstProduct(page: Page): Promise<string> {
  await goToShop(page);
  await waitForPageLoad(page);

  // Find first product card link
  const firstProductLink = page.locator('a[href*="/shop/product/"]').first();
  await expect(firstProductLink).toBeVisible();

  const href = await firstProductLink.getAttribute('href');
  if (!href) {
    throw new Error('No product link found');
  }

  await firstProductLink.click();
  await waitForPageLoad(page);

  return page.url();
}
