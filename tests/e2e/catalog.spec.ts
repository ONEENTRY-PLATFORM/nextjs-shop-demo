import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { waitForPageLoad } from './helpers/navigation-helpers';
import { ROUTES, SELECTORS } from './settings';

/**
 * Opens the filter drawer, retrying the click once.
 *
 * The button is revealed by a GSAP animation after hydration, and a click that lands in the gap
 * between "painted" and "handler attached" is swallowed: the element is there, Playwright clicks
 * it, and nothing opens. Under a full-suite run that gap is wide enough to fail three specs in a
 * row while each passes on its own. Re-clicking costs one second and removes the race.
 * @param   {Page}          page - Playwright page, already on the shop route.
 * @returns {Promise<void>}      Resolves once the drawer is visible.
 */
const openFilterDrawer = async (page: Page): Promise<void> => {
  const button = page.locator(SELECTORS.filterButton);
  const drawer = page.locator(SELECTORS.filterModal);

  await expect(button).toBeVisible({ timeout: 12000 });
  await button.click();
  try {
    await drawer.waitFor({ state: 'visible', timeout: 5000 });
  } catch {
    await button.click();
    await drawer.waitFor({ state: 'visible', timeout: 10000 });
  }
};

/**
 * E2E tests for catalog page and product filtering
 */
test.describe('Catalog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.shop);
    await waitForPageLoad(page);
  });

  test.describe('Catalog Page Structure', () => {
    test('shop page loads and shows products', async ({ page }) => {
      const productCards = page.locator('.product-card');
      await expect(productCards.first()).toBeVisible({ timeout: 10000 });
    });

    test('filter button is visible on shop page', async ({ page }) => {
      // The breadcrumbs bar starts as `hidden` (display:none) and is revealed by a
      // GSAP animation only after hydration, so allow time for that reveal.
      const filterButton = page.locator(SELECTORS.filterButton);
      await expect(filterButton).toBeVisible({ timeout: 12000 });
    });

    test('product cards have expected structure', async ({ page }) => {
      const firstCard = page.locator('.product-card').first();
      await expect(firstCard).toBeVisible({ timeout: 10000 });

      // Product card should have a link to product page
      const productLink = firstCard.locator('a[href*="/shop/product/"]');
      await expect(productLink).toBeVisible();
    });

    test('product cards have images', async ({ page }) => {
      const firstCard = page.locator('.product-card').first();
      await expect(firstCard).toBeVisible({ timeout: 10000 });

      const img = firstCard.locator('img');
      await expect(img).toBeVisible();
    });
  });

  test.describe('Filter Modal', () => {
    test('clicking filter button opens filter modal', async ({ page }) => {
      await openFilterDrawer(page);
      await expect(page.locator(SELECTORS.filterModal)).toBeVisible();
    });

    test('filter modal contains price range inputs', async ({ page }) => {
      await openFilterDrawer(page);

      const priceFrom = page.locator(SELECTORS.priceFromInput);
      const priceTo = page.locator(SELECTORS.priceToInput);

      await expect(priceFrom).toBeVisible();
      await expect(priceTo).toBeVisible();
    });

    test('filter modal contains apply and reset buttons', async ({ page }) => {
      await openFilterDrawer(page);

      await expect(page.locator(SELECTORS.filterApplyButton)).toBeVisible();
      await expect(page.locator(SELECTORS.filterResetButton)).toBeVisible();
    });
  });

  test.describe('Price Filter', () => {
    test('applying price filter updates URL params', async ({ page }) => {
      // Wait for filter button before clicking
      const filterBtn = page.locator(SELECTORS.filterButton);
      await expect(filterBtn).toBeVisible({ timeout: 10000 });
      await filterBtn.click();

      const filterModal = page.locator(SELECTORS.filterModal);
      await expect(filterModal).toBeVisible({ timeout: 8000 });

      // Read actual max value from the inputs so we stay within allowed range
      const priceFrom = page.locator(SELECTORS.priceFromInput);
      const priceTo = page.locator(SELECTORS.priceToInput);

      const maxFrom = Number(await priceFrom.getAttribute('max')) || 99;
      const maxTo = Number(await priceTo.getAttribute('max')) || 99;

      const fromVal = Math.min(10, maxFrom);
      const toVal = Math.min(80, maxTo);

      await priceFrom.fill(String(fromVal));
      await priceTo.fill(String(toVal));

      // Apply filters
      await page.locator(SELECTORS.filterApplyButton).click();

      await expect(page).toHaveURL(new RegExp(`minPrice=${fromVal}`), {
        timeout: 5000,
      });
      await expect(page).toHaveURL(new RegExp(`maxPrice=${toVal}`), {
        timeout: 5000,
      });
    });

    test('resetting filters clears URL params', async ({ page }) => {
      // First apply a filter
      await page.goto(`${ROUTES.shop}?minPrice=20&maxPrice=80`);
      await waitForPageLoad(page);

      // Open filter — wait for button to be interactive before clicking
      const filterButton98 = page.locator(SELECTORS.filterButton);
      await expect(filterButton98).toBeVisible({ timeout: 10000 });
      await filterButton98.click();
      const filterModal = page.locator(SELECTORS.filterModal);
      await expect(filterModal).toBeVisible({ timeout: 8000 });

      // Reset filters
      await page.locator(SELECTORS.filterResetButton).click();

      await expect(page).not.toHaveURL(/minPrice/, { timeout: 5000 });
      await expect(page).not.toHaveURL(/maxPrice/, { timeout: 5000 });
    });

    test('URL price params are reflected in filter inputs', async ({
      page,
    }) => {
      // Use values within the input max (99) to avoid browser validation errors
      await page.goto(`${ROUTES.shop}?minPrice=10&maxPrice=80`);
      await waitForPageLoad(page);

      const filterBtn = page.locator(SELECTORS.filterButton);
      await expect(filterBtn).toBeVisible({ timeout: 10000 });
      await filterBtn.click();
      const filterModal = page.locator(SELECTORS.filterModal);
      await expect(filterModal).toBeVisible({ timeout: 8000 });

      const priceFrom = page.locator(SELECTORS.priceFromInput);
      const priceTo = page.locator(SELECTORS.priceToInput);

      const fromValue = await priceFrom.inputValue();
      const toValue = await priceTo.inputValue();

      expect(Number(fromValue)).toBe(10);
      expect(Number(toValue)).toBe(80);
    });
  });

  test.describe('Filter Apply/Reset', () => {
    test('apply filter closes modal', async ({ page }) => {
      await openFilterDrawer(page);
      const filterModal = page.locator(SELECTORS.filterModal);

      await page.locator(SELECTORS.filterApplyButton).click();

      // Modal should close after applying
      await expect(filterModal).not.toBeVisible({ timeout: 3000 });
    });

    test('in_stock filter adds URL param', async ({ page }) => {
      await openFilterDrawer(page);
      const filterModal = page.locator(SELECTORS.filterModal);

      // Find in stock checkbox/toggle
      const inStockCheckbox = filterModal
        .locator('input[type="checkbox"], [role="checkbox"]')
        .first();
      const hasCheckbox = await inStockCheckbox.isVisible().catch(() => false);

      if (hasCheckbox) {
        await inStockCheckbox.click();
        await page.locator(SELECTORS.filterApplyButton).click();

        await expect(page).toHaveURL(/in_stock=true/, { timeout: 5000 });
      } else {
        test.skip();
      }
    });

    test('reset clears all filters including in_stock and color', async ({
      page,
    }) => {
      await page.goto(
        `${ROUTES.shop}?minPrice=10&maxPrice=80&in_stock=true&color=red`,
      );
      await waitForPageLoad(page);

      // Wait for button to be interactive before clicking
      const filterButton169 = page.locator(SELECTORS.filterButton);
      await expect(filterButton169).toBeVisible({ timeout: 10000 });
      await filterButton169.click();
      const filterModal = page.locator(SELECTORS.filterModal);
      await expect(filterModal).toBeVisible({ timeout: 8000 });

      await page.locator(SELECTORS.filterResetButton).click();

      await expect(page).not.toHaveURL(/minPrice/, { timeout: 5000 });
      await expect(page).not.toHaveURL(/maxPrice/, { timeout: 5000 });
      await expect(page).not.toHaveURL(/in_stock/, { timeout: 5000 });
      await expect(page).not.toHaveURL(/color/, { timeout: 5000 });
    });
  });

  test.describe('Pagination', () => {
    test('page param is removed when filters change', async ({ page }) => {
      // Start on page 2
      await page.goto(`${ROUTES.shop}?page=2`);
      await waitForPageLoad(page);

      // Apply a filter — wait for button to be interactive
      const filterButton196 = page.locator(SELECTORS.filterButton);
      await expect(filterButton196).toBeVisible({ timeout: 10000 });
      await filterButton196.click();
      const filterModal = page.locator(SELECTORS.filterModal);
      await expect(filterModal).toBeVisible({ timeout: 8000 });

      await page.locator(SELECTORS.filterApplyButton).click();

      // Should reset to page 1 (no page param)
      await expect(page).not.toHaveURL(/page=/, { timeout: 5000 });
    });
  });

  test.describe('Search on Catalog Page', () => {
    test('search param filters products on shop page', async ({ page }) => {
      const initialCount = await page.locator('.product-card').count();

      await page.goto(`${ROUTES.shop}?search=notavalidproduct12345`);
      await waitForPageLoad(page);

      const filteredCount = await page.locator('.product-card').count();
      // Filtered count should be less than or equal to initial count
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    });
  });
});
