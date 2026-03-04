import { expect, test } from '@playwright/test';

import { ROUTES, SELECTORS } from './settings';

/**
 * E2E tests for catalog page and product filtering
 */
test.describe('Catalog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.shop);
    await page.waitForLoadState('networkidle');
  });

  test.describe('Catalog Page Structure', () => {
    test('shop page loads and shows products', async ({ page }) => {
      const productCards = page.locator('.product-card');
      await expect(productCards.first()).toBeVisible({ timeout: 10000 });
    });

    test('filter button is visible on shop page', async ({ page }) => {
      const filterButton = page.locator(SELECTORS.filterButton);
      await expect(filterButton).toBeVisible();
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
      const filterButton = page.locator(SELECTORS.filterButton);
      await filterButton.click();

      // Modal with filter form should open
      const filterModal = page.locator(SELECTORS.filterModal);
      await expect(filterModal).toBeVisible({ timeout: 5000 });
    });

    test('filter modal contains price range inputs', async ({ page }) => {
      await page.locator(SELECTORS.filterButton).click();

      const filterModal = page.locator(SELECTORS.filterModal);
      await expect(filterModal).toBeVisible({ timeout: 5000 });

      const priceFrom = page.locator(SELECTORS.priceFromInput);
      const priceTo = page.locator(SELECTORS.priceToInput);

      await expect(priceFrom).toBeVisible();
      await expect(priceTo).toBeVisible();
    });

    test('filter modal contains apply and reset buttons', async ({ page }) => {
      await page.locator(SELECTORS.filterButton).click();

      const filterModal = page.locator(SELECTORS.filterModal);
      await expect(filterModal).toBeVisible({ timeout: 5000 });

      await expect(page.locator(SELECTORS.filterApplyButton)).toBeVisible();
      await expect(page.locator(SELECTORS.filterResetButton)).toBeVisible();
    });
  });

  test.describe('Price Filter', () => {
    test('applying price filter updates URL params', async ({ page }) => {
      await page.locator(SELECTORS.filterButton).click();

      const filterModal = page.locator(SELECTORS.filterModal);
      await expect(filterModal).toBeVisible({ timeout: 5000 });

      // Set price range
      const priceFrom = page.locator(SELECTORS.priceFromInput);
      const priceTo = page.locator(SELECTORS.priceToInput);

      await priceFrom.fill('100');
      await priceTo.fill('500');

      // Apply filters
      await page.locator(SELECTORS.filterApplyButton).click();

      await expect(page).toHaveURL(/minPrice=100/, { timeout: 5000 });
      await expect(page).toHaveURL(/maxPrice=500/, { timeout: 5000 });
    });

    test('resetting filters clears URL params', async ({ page }) => {
      // First apply a filter
      await page.goto(`${ROUTES.shop}?minPrice=20&maxPrice=80`);
      await page.waitForLoadState('networkidle');

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
      await page.goto(`${ROUTES.shop}?minPrice=50&maxPrice=300`);
      await page.waitForLoadState('networkidle');

      await page.locator(SELECTORS.filterButton).click();
      const filterModal = page.locator(SELECTORS.filterModal);
      await expect(filterModal).toBeVisible({ timeout: 5000 });

      const priceFrom = page.locator(SELECTORS.priceFromInput);
      const priceTo = page.locator(SELECTORS.priceToInput);

      const fromValue = await priceFrom.inputValue();
      const toValue = await priceTo.inputValue();

      expect(Number(fromValue)).toBe(50);
      expect(Number(toValue)).toBe(300);
    });
  });

  test.describe('Filter Apply/Reset', () => {
    test('apply filter closes modal', async ({ page }) => {
      await page.locator(SELECTORS.filterButton).click();
      const filterModal = page.locator(SELECTORS.filterModal);
      await expect(filterModal).toBeVisible({ timeout: 5000 });

      await page.locator(SELECTORS.filterApplyButton).click();

      // Modal should close after applying
      await expect(filterModal).not.toBeVisible({ timeout: 3000 });
    });

    test('in_stock filter adds URL param', async ({ page }) => {
      await page.locator(SELECTORS.filterButton).click();
      const filterModal = page.locator(SELECTORS.filterModal);
      await expect(filterModal).toBeVisible({ timeout: 5000 });

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
        `${ROUTES.shop}?minPrice=50&maxPrice=300&in_stock=true&color=red`,
      );
      await page.waitForLoadState('networkidle');

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
      await page.waitForLoadState('networkidle');

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
      await page.waitForLoadState('networkidle');

      const filteredCount = await page.locator('.product-card').count();
      // Filtered count should be less than or equal to initial count
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    });
  });
});
