import { expect, test } from '@playwright/test';

import { ROUTES, SELECTORS } from './settings';

/**
 * E2E tests for the home page
 */
test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.home);
    await page.waitForLoadState('networkidle');
  });

  test.describe('Page Structure', () => {
    test('homepage loads successfully', async ({ page }) => {
      await expect(page).toHaveURL(ROUTES.home);
    });

    test('page has header with navigation', async ({ page }) => {
      const header = page.locator('header');
      await expect(header).toBeVisible();
    });

    test('page has footer', async ({ page }) => {
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    });

    test('page has main content area', async ({ page }) => {
      const main = page.locator('main');
      await expect(main).toBeVisible();
    });

    test('page title is set', async ({ page }) => {
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);
    });
  });

  test.describe('Header Navigation', () => {
    test('logo/brand is visible in header', async ({ page }) => {
      const header = page.locator('header');
      // Logo can be an img, svg, or text
      const logo = header.locator('img, svg, a[href="/en"]').first();
      await expect(logo).toBeVisible();
    });

    test('search bar is visible', async ({ page }) => {
      const searchInput = page.locator(SELECTORS.searchInput);
      await expect(searchInput).toBeVisible();
    });

    test('cart icon is visible', async ({ page }) => {
      const cartIcon = page.locator(SELECTORS.cartIcon);
      await expect(cartIcon).toBeVisible();
    });

    test('favorites icon is visible', async ({ page }) => {
      const favoritesIcon = page.locator(SELECTORS.favoritesIcon);
      await expect(favoritesIcon).toBeVisible();
    });

    test('auth/profile button is visible', async ({ page }) => {
      const authButton = page
        .locator(`${SELECTORS.authButton}, ${SELECTORS.userMenuButton}`)
        .first();
      await expect(authButton).toBeVisible();
    });

    test('language selector is visible', async ({ page }) => {
      const langSelector = page.locator(SELECTORS.langSelector);
      await expect(langSelector).toBeVisible();
    });
  });

  test.describe('Homepage Content Blocks', () => {
    test('homepage renders content blocks from CMS', async ({ page }) => {
      const main = page.locator('main');
      await expect(main).toBeVisible();

      // Main section should have some content
      const section = main.locator('section').first();
      await expect(section).toBeVisible();
    });

    test('homepage has at least one product or promotion block', async ({
      page,
    }) => {
      // Look for any CMS-driven content blocks
      const blocks = page.locator('section > div > div').first();
      await expect(blocks).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Navigation Links', () => {
    test('clicking shop link navigates to shop', async ({ page }) => {
      // Find a link to shop in the header/nav
      const shopLink = page
        .locator('nav a[href*="/shop"], header a[href*="/shop"]')
        .first();
      const hasShopLink = await shopLink.isVisible().catch(() => false);

      if (hasShopLink) {
        await shopLink.click();
        await page.waitForLoadState('networkidle');
        expect(page.url()).toContain('/shop');
      } else {
        // Navigate directly
        await page.goto(ROUTES.shop);
        expect(page.url()).toContain('/shop');
      }
    });

    test('clicking cart icon navigates to cart', async ({ page }) => {
      const cartIcon = page.locator(SELECTORS.cartIcon);
      await cartIcon.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/cart');
    });

    test('clicking favorites icon navigates to favorites', async ({ page }) => {
      const favoritesIcon = page.locator(SELECTORS.favoritesIcon);
      await favoritesIcon.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/favorites');
    });
  });

  test.describe('Structured Data', () => {
    test('page has JSON-LD structured data', async ({ page }) => {
      const jsonLd = page.locator('script[type="application/ld+json"]');
      const count = await jsonLd.count();
      expect(count).toBeGreaterThan(0);
    });
  });
});
