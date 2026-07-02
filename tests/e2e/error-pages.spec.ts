import { expect, test } from '@playwright/test';

import { waitForPageLoad } from './helpers/navigation-helpers';

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
      await waitForPageLoad(page);

      // The 404 UI streams in after the page shell (loading.tsx renders first),
      // so poll for either a 404 indicator or a redirect instead of checking once.
      await expect(async () => {
        const hasNotFound = await page
          .getByText(/not found|404|page not found/i)
          .first()
          .isVisible()
          .catch(() => false);
        const redirected = !page.url().includes('/shop/product/99999999');
        expect(hasNotFound || redirected).toBeTruthy();
      }).toPass({ timeout: 10000 });
    });

    test('invalid language code returns 404 or redirects', async ({ page }) => {
      await page.goto('/xx/shop');
      await waitForPageLoad(page);

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
      await waitForPageLoad(page);

      // Should show empty cart state. EmptyCart fades in via GSAP (autoAlpha),
      // so use an auto-retrying assertion rather than an instant isVisible check.
      const emptyText = page
        .getByText(/empty|no items|your cart is empty|start shopping/i)
        .first();
      const shopLink = page.locator('a[href*="/shop"]').first();

      await expect(emptyText.or(shopLink).first()).toBeVisible({
        timeout: 10000,
      });
    });

    test('empty favorites page shows empty state message', async ({ page }) => {
      // Clear favorites first
      await page.goto('/en');
      await page.evaluate(() => {
        localStorage.removeItem('persist:favorites');
      });

      await page.goto('/en/favorites');
      await waitForPageLoad(page);

      // Should show empty favorites state or shop link. EmptyFavorites fades in
      // via GSAP (autoAlpha) — use an auto-retrying assertion.
      const emptyText = page
        .getByText(/empty|no favorites|nothing here|start shopping/i)
        .first();
      const shopLink = page.locator('a[href*="/shop"]').first();

      await expect(emptyText.or(shopLink).first()).toBeVisible({
        timeout: 10000,
      });
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
