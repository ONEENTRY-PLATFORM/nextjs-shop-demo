import { test } from '@playwright/test';

import { waitForPageLoad } from './helpers/navigation-helpers';

test.describe('Checkout', () => {
  // Increase timeout for cart tests due to animations
  test.setTimeout(60000);
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
    await waitForPageLoad(page);
  });
});
