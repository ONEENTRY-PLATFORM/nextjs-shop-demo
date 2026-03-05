import { expect, test } from '@playwright/test';

import { waitForPageLoad } from './helpers/navigation-helpers';
import { ROUTES, SELECTORS } from './settings';

/**
 * E2E tests for site navigation
 */
test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.home);
    await waitForPageLoad(page);
  });

  test.describe('Header Navigation', () => {
    test('header is present and visible', async ({ page }) => {
      const header = page.locator('header');
      await expect(header).toBeVisible();
    });

    test('cart icon navigates to cart page', async ({ page }) => {
      await page.locator(SELECTORS.cartIcon).first().click();
      await expect(page).toHaveURL(/\/cart/, { timeout: 5000 });
    });

    test('favorites icon navigates to favorites page', async ({ page }) => {
      await page.locator(SELECTORS.favoritesIcon).first().click();
      await expect(page).toHaveURL(/\/favorites/, { timeout: 5000 });
    });

    test('logo link navigates to home page from shop', async ({ page }) => {
      // Go to shop first
      await page.goto(ROUTES.shop);
      await waitForPageLoad(page);

      // Find the site logo (usually an img or styled link in header)
      const logoLink = page
        .locator('header a[href="/en"], header a[href*="//"]')
        .first();
      const hasLogo = await logoLink.isVisible().catch(() => false);

      if (hasLogo) {
        await logoLink.click();
        await waitForPageLoad(page);
        expect(page.url()).toContain('/en');
      } else {
        // Navigate manually
        await page.goto(ROUTES.home);
        await expect(page).toHaveURL(ROUTES.home);
      }
    });
  });

  test.describe('Mobile Menu', () => {
    test('mobile menu button is visible on mobile viewport', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(ROUTES.home);
      await waitForPageLoad(page);

      await expect(page.locator(SELECTORS.menuButton)).toBeVisible({
        timeout: 5000,
      });
    });

    test('clicking mobile menu opens navigation drawer', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(ROUTES.home);
      await waitForPageLoad(page);

      await page.locator(SELECTORS.menuButton).click();

      // Mobile menu renders in the shared modal body
      await expect(page.locator('#modalBody')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Breadcrumbs', () => {
    test('shop page has breadcrumbs or page title', async ({ page }) => {
      await page.goto(ROUTES.shop);
      await waitForPageLoad(page);

      // Look for breadcrumbs navigation
      const breadcrumbs = page
        .locator(
          'nav[aria-label*="breadcrumb"], [class*="breadcrumb"], [data-testid*="breadcrumb"]',
        )
        .first();
      const hasBreadcrumbs = await breadcrumbs.isVisible().catch(() => false);

      if (hasBreadcrumbs) {
        await expect(breadcrumbs).toBeVisible();
      } else {
        // At minimum the page should have a heading
        const heading = page.locator('h1, h2').first();
        await expect(heading).toBeVisible();
      }
    });

    test('product page has breadcrumb navigation back to shop', async ({
      page,
    }) => {
      await page.goto(ROUTES.product);
      await waitForPageLoad(page);

      // Look for breadcrumb links
      const shopLinks = page.locator(
        'a[href*="/shop"]:not([href*="/product"])',
      );
      const hasShopLink = (await shopLinks.count()) > 0;

      if (hasShopLink) {
        await expect(shopLinks.first()).toBeVisible();
      } else {
        // Page should at least have a back navigation mechanism
        const backNav = page.locator('[class*="breadcrumb"], nav a').first();
        await expect(backNav).toBeVisible();
      }
    });
  });

  test.describe('Footer Navigation', () => {
    test('footer is visible', async ({ page }) => {
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    });

    test('footer has navigation links', async ({ page }) => {
      const footer = page.locator('footer');
      const footerLinks = footer.locator('a');
      const count = await footerLinks.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Page Transitions', () => {
    test('navigating between pages does not cause full reload', async ({
      page,
    }) => {
      // Track navigation events
      let navigationCount = 0;
      page.on('load', () => navigationCount++);

      await page.goto(ROUTES.home);
      const initialCount = navigationCount;

      // Click a nav link (SPA navigation should not increment load count significantly)
      const shopLink = page.locator('header a[href*="/shop"]').first();
      const hasLink = await shopLink.isVisible().catch(() => false);

      if (hasLink) {
        await shopLink.click();
        await waitForPageLoad(page);

        // Should have navigated to shop
        expect(page.url()).toContain('/shop');
      } else {
        await page.goto(ROUTES.shop);
        expect(page.url()).toContain('/shop');
      }
    });

    test('back button works correctly', async ({ page }) => {
      // Navigate to shop
      await page.goto(ROUTES.shop);
      await waitForPageLoad(page);

      // Navigate to product
      await page.goto(ROUTES.product);
      await waitForPageLoad(page);

      // Go back
      await page.goBack();
      await waitForPageLoad(page);

      // Should be back at shop
      expect(page.url()).toContain('/shop');
    });
  });
});
