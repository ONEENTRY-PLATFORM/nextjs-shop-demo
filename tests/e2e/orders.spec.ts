import { expect, test } from '@playwright/test';

import { clearAuthState, signIn } from './helpers/auth-helpers';
import { ROUTES, TEST_AUTH_USER } from './settings';

/**
 * E2E tests for the orders page
 */
test.describe('Orders Page', () => {
  test.describe('Unauthenticated Access', () => {
    test('orders page shows auth error when not logged in', async ({ page }) => {
      await page.goto(ROUTES.orders);
      await page.waitForLoadState('networkidle');

      const url = page.url();
      const isOnOrders = url.includes('/orders');

      if (isOnOrders) {
        // Should show auth error or login prompt
        const loginPrompt = page.getByText(
          /sign in|log in|please login|unauthorized|you must be/i,
        );
        const hasPrompt = await loginPrompt.isVisible().catch(() => false);
        expect(hasPrompt).toBeTruthy();
      } else {
        // Redirected away
        expect(url).not.toContain('/orders');
      }
    });
  });

  test.describe('Authenticated Access', () => {
    test.beforeEach(async ({ page }) => {
      await signIn(page, TEST_AUTH_USER.email, TEST_AUTH_USER.password);
    });

    test.afterEach(async ({ page }) => {
      await clearAuthState(page);
    });

    test('authenticated user can access orders page', async ({ page }) => {
      await page.goto(ROUTES.orders);
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('/orders');

      // Should not show auth error
      const loginPrompt = page.getByText(/sign in|log in|please login/i);
      await expect(loginPrompt).not.toBeVisible();
    });

    test('orders page shows table or empty state', async ({ page }) => {
      await page.goto(ROUTES.orders);
      await page.waitForLoadState('networkidle');

      // Wait for orders to load
      await page.waitForTimeout(2000);

      // Should show either orders table or empty orders message
      const ordersTable = page.locator('.orders-table, .orders-page');
      const emptyOrders = page.locator(
        'a[href*="/shop"]',
      );

      const hasTable = await ordersTable.isVisible().catch(() => false);
      const hasEmpty = await emptyOrders.isVisible().catch(() => false);

      expect(hasTable || hasEmpty).toBeTruthy();
    });

    test('orders table has column headers', async ({ page }) => {
      await page.goto(ROUTES.orders);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Check for table column headers (Date, Total, Status)
      const ordersTable = page.locator('.orders-table');
      const hasTable = await ordersTable.isVisible().catch(() => false);

      if (hasTable) {
        // Table should have some header text visible
        const headerRow = ordersTable.locator('[class*="border-y"]').first();
        await expect(headerRow).toBeVisible();
      } else {
        // Empty orders state is acceptable
        test.skip();
      }
    });

    test('empty orders state shows link to shop', async ({ page }) => {
      await page.goto(ROUTES.orders);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // If there are no orders, should show empty state with shop link
      const shopLink = page.locator('a[href*="/shop"]');
      const hasShopLink = await shopLink.isVisible().catch(() => false);

      const ordersTable = page.locator('.orders-table__body .orders-row, [class*="orders-row"]');
      const hasOrders = (await ordersTable.count()) > 0;

      if (!hasOrders && hasShopLink) {
        await expect(shopLink.first()).toBeVisible();
      } else {
        // Has orders — acceptable
        expect(hasOrders).toBeTruthy();
      }
    });

    test('orders page has navigation', async ({ page }) => {
      await page.goto(ROUTES.orders);
      await page.waitForLoadState('networkidle');

      const nav = page.locator('nav, header');
      await expect(nav.first()).toBeVisible();
    });
  });
});
