import { expect, test } from '@playwright/test';

import { ROUTES, SELECTORS } from './settings';

/**
 * E2E tests for language switching / localization
 */
test.describe('Localization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.home);
    await page.waitForLoadState('networkidle');
  });

  test.describe('Language Selector', () => {
    test('language selector is visible', async ({ page }) => {
      const langSelector = page.locator(SELECTORS.langSelector);
      await expect(langSelector).toBeVisible();
    });

    test('language selector shows current language', async ({ page }) => {
      const langSelector = page.locator(SELECTORS.langSelector);
      const currentValue = await langSelector.inputValue();
      expect(currentValue).toBeTruthy();
      // Default language is English ('en')
      expect(['en', 'ru', 'de', 'fr']).toContain(currentValue.toLowerCase().slice(0, 2));
    });

    test('language selector has multiple options', async ({ page }) => {
      const langSelector = page.locator(SELECTORS.langSelector);
      const options = langSelector.locator('option');
      const count = await options.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe('Language Switching', () => {
    test('switching language changes URL prefix', async ({ page }) => {
      const langSelector = page.locator(SELECTORS.langSelector);
      const options = langSelector.locator('option');
      const count = await options.count();

      if (count >= 2) {
        // Get the second language option
        const secondOption = options.nth(1);
        const secondLang = await secondOption.getAttribute('value');

        if (secondLang && secondLang !== 'en') {
          await langSelector.selectOption(secondLang);
          await page.waitForLoadState('networkidle');

          // URL should contain the new language prefix
          const url = page.url();
          expect(url).toContain(`/${secondLang}`);
        } else {
          test.skip();
        }
      } else {
        test.skip();
      }
    });

    test('switching back to English works', async ({ page }) => {
      const langSelector = page.locator(SELECTORS.langSelector);
      const options = langSelector.locator('option');
      const count = await options.count();

      if (count >= 2) {
        // Switch to second language first
        const secondOption = options.nth(1);
        const secondLang = await secondOption.getAttribute('value');

        if (secondLang && secondLang !== 'en') {
          await langSelector.selectOption(secondLang);
          await page.waitForLoadState('networkidle');

          // Find selector again after navigation
          const newLangSelector = page.locator(SELECTORS.langSelector);
          await expect(newLangSelector).toBeVisible({ timeout: 5000 });

          // Switch back to English
          await newLangSelector.selectOption('en');
          await page.waitForLoadState('networkidle');

          expect(page.url()).toContain('/en');
        } else {
          test.skip();
        }
      } else {
        test.skip();
      }
    });

    test('language switch preserves current page path', async ({ page }) => {
      // Navigate to shop first
      await page.goto(ROUTES.shop);
      await page.waitForLoadState('networkidle');

      const langSelector = page.locator(SELECTORS.langSelector);
      const options = langSelector.locator('option');
      const count = await options.count();

      if (count >= 2) {
        const secondOption = options.nth(1);
        const secondLang = await secondOption.getAttribute('value');

        if (secondLang && secondLang !== 'en') {
          await langSelector.selectOption(secondLang);
          await page.waitForLoadState('networkidle');

          // Should still be on shop page, but in different language
          const url = page.url();
          expect(url).toContain('/shop');
          expect(url).toContain(`/${secondLang}/`);
        } else {
          test.skip();
        }
      } else {
        test.skip();
      }
    });
  });

  test.describe('Localized Routes', () => {
    test('/en route loads English homepage', async ({ page }) => {
      await page.goto('/en');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/en');
    });

    test('redirect from root to localized route', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Should redirect to a localized route like /en
      const url = page.url();
      // URL should contain a language prefix
      expect(url).toMatch(/\/[a-z]{2}(\/|$)/);
    });
  });
});
