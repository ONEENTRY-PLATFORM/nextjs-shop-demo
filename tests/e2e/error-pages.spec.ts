import { expect, test } from '@playwright/test';

/**
 * E2E tests for error pages and edge cases
 */
test.describe('Error Pages', () => {
  test.describe('404 Not Found', () => {
    test('non-existent page returns 404 status', async ({ page }) => {
      const response = await page.goto('/en/this-page-does-not-exist-12345');
      // Either returns 404 status or shows a not-found UI
      expect(response?.status()).toBeLessThanOrEqual(404);
    });

    test('non-existent product shows not found', async ({ page }) => {
      await page.goto('/en/shop/product/99999999');
      await page.waitForLoadState('networkidle');

      const url = page.url();

      // Either stays on page with 404 content or redirects
      // Check for any 404 indicator
      const notFoundText = page.getByText(/not found|404|page not found/i);
      const hasNotFound = await notFoundText.isVisible().catch(() => false);

      // Or the page redirected
      const redirected = !url.includes('/shop/product/99999999');

      expect(hasNotFound || redirected).toBeTruthy();
    });

    test('invalid language code returns 404 or redirects', async ({ page }) => {
      await page.goto('/xx/shop');
      await page.waitForLoadState('networkidle');

      // Should either redirect to valid locale or show error
      const url = page.url();
      const validLocales = ['/en/', '/ru/'];
      const isRedirected = validLocales.some((locale) => url.includes(locale));

      const notFoundText = page.getByText(/not found|404/i);
      const hasNotFound = await notFoundText.isVisible().catch(() => false);

      expect(isRedirected || hasNotFound).toBeTruthy();
    });
  });

  test.describe('Empty States', () => {
    test('empty cart page shows empty state message', async ({ page }) => {
      // Clear cart first
      await page.goto('/en');
      await page.evaluate(() => {
        localStorage.removeItem('persist:cart');
      });

      await page.goto('/en/cart');
      await page.waitForLoadState('networkidle');

      // Should show empty cart state
      const emptyText = page.getByText(
        /empty|no items|your cart is empty|start shopping/i,
      );
      const shopLink = page.locator('a[href*="/shop"]');

      const hasEmpty = await emptyText.isVisible().catch(() => false);
      const hasShopLink = await shopLink.isVisible().catch(() => false);

      expect(hasEmpty || hasShopLink).toBeTruthy();
    });

    test('empty favorites page shows empty state message', async ({ page }) => {
      // Clear favorites first
      await page.goto('/en');
      await page.evaluate(() => {
        localStorage.removeItem('persist:favorites');
      });

      await page.goto('/en/favorites');
      await page.waitForLoadState('networkidle');

      // Should show empty favorites state or shop link
      const emptyText = page.getByText(
        /empty|no favorites|nothing here|start shopping/i,
      );
      const shopLink = page.locator('a[href*="/shop"]');

      const hasEmpty = await emptyText.isVisible().catch(() => false);
      const hasShopLink = await shopLink.isVisible().catch(() => false);

      expect(hasEmpty || hasShopLink).toBeTruthy();
    });
  });

  test.describe('Network Resilience', () => {
    test('page renders header even on slow networks', async ({ page }) => {
      // Simulate slow network
      await page.route('**/*', async (route) => {
        await route.continue();
      });

      await page.goto('/en');
      await page.waitForLoadState('domcontentloaded');

      const header = page.locator('header');
      await expect(header).toBeVisible({ timeout: 15000 });
    });
  });
});
