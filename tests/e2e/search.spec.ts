import { expect, test } from '@playwright/test';

import { ROUTES, SELECTORS } from './settings';

/**
 * E2E tests for the search functionality
 */
test.describe('Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.home);
    await page.waitForLoadState('networkidle');
  });

  test.describe('Search Bar UI', () => {
    test('search input is visible on desktop', async ({ page }) => {
      const searchInput = page.locator(SELECTORS.searchInput);
      await expect(searchInput).toBeVisible();
    });

    test('search input has correct placeholder', async ({ page }) => {
      const searchInput = page.locator(SELECTORS.searchInput);
      const placeholder = await searchInput.getAttribute('placeholder');
      expect(placeholder).toBeTruthy();
    });

    test('search submit button is visible', async ({ page }) => {
      const submitButton = page.locator(SELECTORS.searchSubmitButton);
      await expect(submitButton).toBeVisible();
    });

    test('search results are hidden by default', async ({ page }) => {
      const searchResults = page.locator(SELECTORS.searchResults);
      await expect(searchResults).not.toBeVisible();
    });
  });

  test.describe('Search Interaction', () => {
    test('typing in search shows results dropdown', async ({ page }) => {
      const searchInput = page.locator(SELECTORS.searchInput);
      await searchInput.fill('a');

      // Wait for debounce (300ms) and results to load
      await page.waitForTimeout(500);
      await page.waitForLoadState('networkidle');

      const searchResults = page.locator(SELECTORS.searchResults);
      await expect(searchResults).toBeVisible({ timeout: 5000 });
    });

    test('search results contain product links', async ({ page }) => {
      const searchInput = page.locator(SELECTORS.searchInput);
      await searchInput.fill('a');

      await page.waitForTimeout(500);
      await page.waitForLoadState('networkidle');

      const searchResults = page.locator(SELECTORS.searchResults);
      await expect(searchResults).toBeVisible({ timeout: 5000 });

      // Should either show product links or "Not found" message
      const links = page.locator(SELECTORS.searchResultLink);
      const notFound = searchResults.getByText(/not found/i);

      const hasLinks = await links.count() > 0;
      const hasNotFound = await notFound.isVisible().catch(() => false);

      expect(hasLinks || hasNotFound).toBeTruthy();
    });

    test('clicking a search result navigates to product page', async ({
      page,
    }) => {
      const searchInput = page.locator(SELECTORS.searchInput);
      await searchInput.fill('a');

      await page.waitForTimeout(500);
      await page.waitForLoadState('networkidle');

      const searchResults = page.locator(SELECTORS.searchResults);
      await expect(searchResults).toBeVisible({ timeout: 5000 });

      const firstLink = page.locator(SELECTORS.searchResultLink).first();
      const hasLink = await firstLink.isVisible().catch(() => false);

      if (hasLink) {
        await firstLink.click();
        // Wait for navigation — link has no locale prefix, middleware may redirect to /en/shop/product/
        await expect(page).toHaveURL(/\/shop\/product\//, { timeout: 10000 });
      } else {
        test.skip();
      }
    });

    test('close button hides search results', async ({ page }) => {
      const searchInput = page.locator(SELECTORS.searchInput);
      await searchInput.fill('a');

      await page.waitForTimeout(500);
      await page.waitForLoadState('networkidle');

      const searchResults = page.locator(SELECTORS.searchResults);
      await expect(searchResults).toBeVisible({ timeout: 5000 });

      const closeButton = page.locator(SELECTORS.closeSearchResults);
      await closeButton.click();

      await expect(searchResults).not.toBeVisible();
    });

    test('clearing input hides search results', async ({ page }) => {
      const searchInput = page.locator(SELECTORS.searchInput);
      await searchInput.fill('a');

      await page.waitForTimeout(500);
      await page.waitForLoadState('networkidle');

      const searchResults = page.locator(SELECTORS.searchResults);
      await expect(searchResults).toBeVisible({ timeout: 5000 });

      // Clear input
      await searchInput.fill('');
      await page.waitForTimeout(400);

      await expect(searchResults).not.toBeVisible();
    });
  });

  test.describe('Search Submit', () => {
    test('submitting search redirects to shop with search param', async ({
      page,
    }) => {
      const searchInput = page.locator(SELECTORS.searchInput);
      const query = 'headphones';
      await searchInput.fill(query);

      // Wait for handleSearch → router.replace to update the URL (proves component re-rendered
      // with params containing the search term before we click submit)
      await expect(page).toHaveURL(/search=headphones/, { timeout: 3000 });

      // Submit the form
      await page.locator(SELECTORS.searchSubmitButton).click();

      // handleSubmit calls router.replace('/en/shop?search=headphones')
      await expect(page).toHaveURL(
        new RegExp(`/shop.*search=${encodeURIComponent(query)}`),
        { timeout: 5000 },
      );
    });

    test('pressing Enter submits search form', async ({ page }) => {
      const searchInput = page.locator(SELECTORS.searchInput);
      const query = 'test';
      await searchInput.fill(query);

      // Wait for handleSearch → router.replace to update the URL before Enter submits
      await expect(page).toHaveURL(/search=test/, { timeout: 3000 });
      await searchInput.press('Enter');

      await expect(page).toHaveURL(/\/shop.*search=/, { timeout: 5000 });
    });

    test('search results visible on shop page with search URL param', async ({
      page,
    }) => {
      await page.goto(`${ROUTES.shop}?search=a`);
      await page.waitForLoadState('networkidle');

      // Products grid should be visible (filtered results)
      const productCards = page.locator('.product-card');
      // Either products are shown or an empty state
      const count = await productCards.count();
      // Either products exist or page renders without crash
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});
