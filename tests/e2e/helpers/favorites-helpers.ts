import type { Locator, Page } from '@playwright/test';

import { SELECTORS } from '../fixtures/test-data';

/**
 * Helper functions for favorites operations in E2E tests
 */

/**
 * Gets the favorites badge locator (first one if multiple exist)
 * @param   {Page}    page - Playwright page object
 * @returns {Locator}      Favorites badge locator
 */
export function getFavoritesBadge(page: Page): Locator {
  // Use .first() to handle cases where badge appears multiple times (desktop + mobile)
  return page
    .locator(SELECTORS.favoritesIcon)
    .locator('[data-testid="favorites-badge"]')
    .first();
}

/**
 * Gets the number of items in favorites from the favorites icon badge
 * @param   {Page}            page - Playwright page object
 * @returns {Promise<number>}      Number of items in favorites
 */
export async function getFavoritesItemCount(page: Page): Promise<number> {
  const badge = getFavoritesBadge(page);

  const isVisible = await badge.isVisible().catch(() => false);
  if (!isVisible) {
    return 0;
  }

  const count = await badge.textContent();
  const trimmedCount = count ? count.trim() : '0';
  const parsedCount = parseInt(trimmedCount, 10);
  return isNaN(parsedCount) ? 0 : parsedCount;
}

/**
 * Opens the favorites page by navigating directly
 * @param {Page}   page - Playwright page object
 * @param {string} lang - Language code
 */
export async function openFavorites(
  page: Page,
  lang: string = 'en',
): Promise<void> {
  // Navigate directly to favorites page
  await page.goto(`/${lang}/favorites`);

  // Wait for page load
  await page.waitForLoadState('networkidle');
}
