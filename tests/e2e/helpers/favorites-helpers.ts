import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { SELECTORS } from '../settings';
import { waitForPageLoad } from './navigation-helpers';

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
    .locator('[data-testid="favorites-badge"]:visible')
    .first();
}

/**
 * Clicks a favourites heart and waits for the badge to reach `expected`, retrying the click.
 *
 * The heart is a client component revealed with the rest of the card, and a click that lands
 * before its handler is attached is swallowed: Playwright reports a successful click, the badge
 * never moves, and the spec fails with the button plainly visible. The flow passes on its own
 * and fails inside a full run, which is the signature of that gap.
 * @param   {Locator}       heart    - The card's favourites button.
 * @param   {Page}          page     - Playwright page object.
 * @param   {number}        expected - Badge value the click should produce.
 * @returns {Promise<void>}          Resolves once the badge shows `expected`.
 */
export async function clickFavoriteAndExpect(
  heart: Locator,
  page: Page,
  expected: number,
): Promise<void> {
  await expect(async () => {
    await heart.click({ timeout: 4000 }).catch(() => {});
    await expect(getFavoritesBadge(page)).toHaveText(String(expected), {
      timeout: 4000,
    });
  }).toPass({ timeout: 20000 });
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
  await waitForPageLoad(page);
}
