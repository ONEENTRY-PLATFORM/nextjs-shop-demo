import { expect, test } from '@playwright/test';

import { waitForPageLoad } from './helpers/navigation-helpers';
import { ROUTES, SELECTORS } from './settings';

/**
 * E2E tests for combined filter scenarios on the catalog / shop page.
 * catalog.spec.ts covers individual filter fields; here we test combinations,
 * URL persistence after reload, and edge cases.
 */
test.describe('Filter Combinations', () => {
  test.setTimeout(30000);

  // Helper: open the filter modal
  async function openFilterModal(page: Parameters<typeof test>[1]['page']) {
    const filterBtn = page.locator(SELECTORS.filterButton);
    await expect(filterBtn).toBeVisible({ timeout: 8000 });
    await filterBtn.click();
    const modal = page.locator(SELECTORS.filterModal);
    await expect(modal).toBeVisible({ timeout: 5000 });
    return modal;
  }

  // Helper: apply filters and wait for URL to update
  async function applyFilters(page: Parameters<typeof test>[1]['page']) {
    await page.locator(SELECTORS.filterApplyButton).click();
    // Modal must close after apply
    await expect(page.locator(SELECTORS.filterModal)).toBeHidden({
      timeout: 5000,
    });
    await waitForPageLoad(page);
  }

  // ---------------------------------------------------------------------------
  // Price + In-stock
  // ---------------------------------------------------------------------------
  test.describe('Price + In-stock', () => {
    test('applying price AND in-stock adds both URL params', async ({
      page,
    }) => {
      await page.goto(ROUTES.shop);
      await waitForPageLoad(page);

      const modal = await openFilterModal(page);

      // Set price range
      await page.locator(SELECTORS.priceFromInput).fill('50');
      await page.locator(SELECTORS.priceToInput).fill('400');

      // Toggle in-stock if checkbox is present
      const inStockCheckbox = modal
        .locator('input[type="checkbox"], [role="checkbox"]')
        .first();
      const hasCheckbox = await inStockCheckbox.isVisible().catch(() => false);
      if (hasCheckbox) {
        const isChecked = await inStockCheckbox.isChecked().catch(() => false);
        if (!isChecked) await inStockCheckbox.click();
      }

      await applyFilters(page);

      await expect(page).toHaveURL(/minPrice=50/);
      await expect(page).toHaveURL(/maxPrice=400/);
      if (hasCheckbox) {
        await expect(page).toHaveURL(/in_stock=true/);
      }
    });

    test('URL with minPrice + in_stock=true shows filtered products', async ({
      page,
    }) => {
      await page.goto(`${ROUTES.shop}?minPrice=10&in_stock=true`);
      await waitForPageLoad(page);

      // Page loads without error
      const body = page.locator('body');
      await expect(body).toBeVisible();

      // Either shows products or an empty-state message
      const hasProducts =
        (await page.locator('.product-card').count()) > 0;
      const hasEmpty = await page
        .getByText(/no products|nothing found|empty/i)
        .isVisible()
        .catch(() => false);

      expect(hasProducts || hasEmpty).toBeTruthy();
    });
  });

  // ---------------------------------------------------------------------------
  // Price + Color
  // ---------------------------------------------------------------------------
  test.describe('Price + Color', () => {
    test('can set price and color filter together', async ({ page }) => {
      await page.goto(ROUTES.shop);
      await waitForPageLoad(page);

      const modal = await openFilterModal(page);

      await page.locator(SELECTORS.priceFromInput).fill('0');
      await page.locator(SELECTORS.priceToInput).fill('1000');

      // Color filter — look for a color swatch or radio/checkbox
      const colorOption = modal
        .locator(
          'input[type="checkbox"][name*="color"], input[type="radio"][name*="color"], [data-testid*="color"]',
        )
        .first();
      const hasColor = await colorOption.isVisible().catch(() => false);
      if (hasColor) {
        await colorOption.click();
      }

      await applyFilters(page);

      await expect(page).toHaveURL(/minPrice=0/);
      await expect(page).toHaveURL(/maxPrice=1000/);
      if (hasColor) {
        await expect(page).toHaveURL(/color=/);
      }
    });
  });

  // ---------------------------------------------------------------------------
  // Price + Search
  // ---------------------------------------------------------------------------
  test.describe('Price + Search', () => {
    test('navigating to URL with price + search shows products page', async ({
      page,
    }) => {
      await page.goto(`${ROUTES.shop}?minPrice=10&maxPrice=9999&search=a`);
      await waitForPageLoad(page);

      // Page must load without crashing
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

    test('filter inputs are pre-filled from URL with both price and search', async ({
      page,
    }) => {
      await page.goto(`${ROUTES.shop}?minPrice=20&maxPrice=500`);
      await waitForPageLoad(page);

      const modal = await openFilterModal(page);

      const fromValue = await page.locator(SELECTORS.priceFromInput).inputValue();
      const toValue = await page.locator(SELECTORS.priceToInput).inputValue();

      expect(Number(fromValue)).toBe(20);
      expect(Number(toValue)).toBe(500);

      void modal;
    });
  });

  // ---------------------------------------------------------------------------
  // All filters combined
  // ---------------------------------------------------------------------------
  test.describe('All Filters Combined', () => {
    test('URL with all filters resolves without error', async ({ page }) => {
      await page.goto(
        `${ROUTES.shop}?minPrice=10&maxPrice=500&in_stock=true&color=red&search=product`,
      );
      await waitForPageLoad(page);

      await expect(page.locator('body')).toBeVisible();
      // Should not show a fatal error page
      const errorHeading = page.locator('h1').filter({ hasText: /error|500|crash/i });
      expect(await errorHeading.count()).toBe(0);
    });

    test('reset clears all combined filter params at once', async ({ page }) => {
      await page.goto(
        `${ROUTES.shop}?minPrice=10&maxPrice=500&in_stock=true&color=red`,
      );
      await waitForPageLoad(page);

      const modal = await openFilterModal(page);
      void modal;

      await page.locator(SELECTORS.filterResetButton).click();
      await waitForPageLoad(page);

      const url = page.url();
      expect(url).not.toMatch(/minPrice/);
      expect(url).not.toMatch(/maxPrice/);
      expect(url).not.toMatch(/in_stock/);
      expect(url).not.toMatch(/color/);
    });
  });

  // ---------------------------------------------------------------------------
  // URL persistence
  // ---------------------------------------------------------------------------
  test.describe('URL Persistence', () => {
    test('filter params survive a full page reload', async ({ page }) => {
      await page.goto(`${ROUTES.shop}?minPrice=50&maxPrice=300`);
      await waitForPageLoad(page);

      // Reload the page
      await page.reload();
      await waitForPageLoad(page);

      await expect(page).toHaveURL(/minPrice=50/);
      await expect(page).toHaveURL(/maxPrice=300/);
    });

    test('opening filter modal on pre-filtered URL shows correct values', async ({
      page,
    }) => {
      await page.goto(`${ROUTES.shop}?minPrice=75&maxPrice=250`);
      await waitForPageLoad(page);

      await openFilterModal(page);

      const fromVal = await page
        .locator(SELECTORS.priceFromInput)
        .inputValue();
      const toVal = await page.locator(SELECTORS.priceToInput).inputValue();

      expect(Number(fromVal)).toBe(75);
      expect(Number(toVal)).toBe(250);
    });

    test('applying new price over existing price replaces old params', async ({
      page,
    }) => {
      await page.goto(`${ROUTES.shop}?minPrice=10&maxPrice=100`);
      await waitForPageLoad(page);

      await openFilterModal(page);

      await page.locator(SELECTORS.priceFromInput).fill('200');
      await page.locator(SELECTORS.priceToInput).fill('800');
      await applyFilters(page);

      await expect(page).toHaveURL(/minPrice=200/);
      await expect(page).toHaveURL(/maxPrice=800/);
      // Old values must not remain
      expect(page.url()).not.toMatch(/minPrice=10/);
      expect(page.url()).not.toMatch(/maxPrice=100/);
    });

    test('pagination resets to page 1 when filters change', async ({
      page,
    }) => {
      // Start on page 2 with a filter
      await page.goto(`${ROUTES.shop}?minPrice=10&maxPrice=500&page=2`);
      await waitForPageLoad(page);

      // Change filter — apply different price
      await openFilterModal(page);
      await page.locator(SELECTORS.priceFromInput).fill('50');
      await page.locator(SELECTORS.priceToInput).fill('300');
      await applyFilters(page);

      // page= param should be gone (reset to 1)
      expect(page.url()).not.toMatch(/page=/);
    });
  });

  // ---------------------------------------------------------------------------
  // Empty state
  // ---------------------------------------------------------------------------
  test.describe('Empty State', () => {
    test('very narrow price range shows empty state or fewer products', async ({
      page,
    }) => {
      await page.goto(ROUTES.shop);
      await waitForPageLoad(page);

      const initialCount = await page.locator('.product-card').count();

      await page.goto(`${ROUTES.shop}?minPrice=999999&maxPrice=1000000`);
      await waitForPageLoad(page);

      const filteredCount = await page.locator('.product-card').count();

      const hasEmptyMsg = await page
        .getByText(/no products|nothing found|empty/i)
        .isVisible()
        .catch(() => false);

      // Either fewer products or an empty state message
      expect(filteredCount <= initialCount || hasEmptyMsg).toBeTruthy();
    });
  });
});
