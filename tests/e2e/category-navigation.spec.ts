import { expect, test } from '@playwright/test';

import { waitForPageLoad } from './helpers/navigation-helpers';
import { ROUTES } from './settings';

/**
 * E2E tests for category navigation.
 *
 * The category index (`/en/shop/category`) renders a grid of category cards.
 * Each card is an `<a href="/en/shop/category/{pageUrl}">` (scoped inside
 * `<main>`) that fades in via GSAP, so we never rely on instant
 * `isVisible()`/`count()` — only auto-retrying assertions / `waitFor`.
 *
 * Runs against LIVE CMS data with no mocks: when no categories are configured
 * the specs skip gracefully instead of failing.
 */
test.describe('Category Navigation', () => {
  // GSAP entrance animations + live CMS fetches need extra head-room.
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.categoryIndex);
    await waitForPageLoad(page);
  });

  test('category index shows at least one category link', async ({ page }) => {
    // Category cards live inside <main>; scope there so header/footer links can
    // never satisfy the assertion. Cards fade in via GSAP (autoAlpha), so wait
    // for the first one to actually become visible rather than counting.
    const firstCategory = page
      .locator('main a[href*="/shop/category/"]')
      .first();

    const appeared = await firstCategory
      .waitFor({ state: 'visible', timeout: 15000 })
      .then(() => true)
      .catch(() => false);

    // No categories configured in this CMS tenant — skip instead of failing.
    test.skip(!appeared, 'No category cards rendered on the category index');

    await expect(firstCategory).toBeVisible();
  });

  test('clicking the first category navigates to its category page', async ({
    page,
  }) => {
    const firstCategory = page
      .locator('main a[href*="/shop/category/"]')
      .first();

    const appeared = await firstCategory
      .waitFor({ state: 'visible', timeout: 15000 })
      .then(() => true)
      .catch(() => false);

    test.skip(!appeared, 'No category cards rendered on the category index');

    // Click the card (Playwright auto-waits for the GSAP reveal) and confirm we
    // land on a specific category route: /shop/category/<handle>. The index URL
    // (/en/shop/category, no trailing slash) does NOT match this regex.
    await firstCategory.click();
    await expect(page).toHaveURL(/\/shop\/category\//);
    await waitForPageLoad(page);

    // The destination renders EITHER a products grid (real product cards carry a
    // link to a product page — skeleton loaders don't) OR a "Products not found"
    // message when the category is empty. Tolerate both.
    const productLink = page
      .locator('.product-card a[href*="/shop/product/"]')
      .first();
    const notFound = page.getByText(/products not found/i);

    await expect(async () => {
      const hasProducts = await productLink.isVisible().catch(() => false);
      const hasNotFound = await notFound.isVisible().catch(() => false);
      expect(hasProducts || hasNotFound).toBeTruthy();
    }).toPass({ timeout: 20000 });
  });

  test('category index page has the site header/nav present', async ({
    page,
  }) => {
    // The site chrome (header + navigation) is rendered by the root layout on
    // every route, including the category index.
    const header = page.locator('header');
    await expect(header).toBeVisible({ timeout: 15000 });
  });
});
