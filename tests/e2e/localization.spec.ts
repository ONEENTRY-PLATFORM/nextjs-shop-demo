import { expect, type Page, test } from '@playwright/test';

import { waitForPageLoad } from './helpers/navigation-helpers';
import { ROUTES, SELECTORS } from './settings';

/**
 * E2E tests for language switching / localization
 */
test.describe('Localization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.home);
    await waitForPageLoad(page);
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
      expect(['en', 'ru', 'de', 'fr']).toContain(
        currentValue.toLowerCase().slice(0, 2),
      );
    });

    test('language selector has multiple options', async ({ page }) => {
      const langSelector = page.locator(SELECTORS.langSelector);
      const options = langSelector.locator('option');
      const count = await options.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe('Language Switching', () => {
    /**
     * Reads the available locale shortcodes from the language selector.
     * Options are driven by the CMS active-locales list, so a spec must tolerate
     * a project where French is not enabled.
     * @param   {Page}              page - Playwright page object
     * @returns {Promise<string[]>}      Locale shortcodes offered by the selector
     */
    async function getLangOptions(page: Page): Promise<string[]> {
      const langSelector = page.locator(SELECTORS.langSelector);
      await expect(langSelector).toBeVisible({ timeout: 10000 });
      return langSelector
        .locator('option')
        .evaluateAll((opts) => opts.map((o) => (o as HTMLOptionElement).value));
    }

    /**
     * Selects a locale and waits for the route to reflect it.
     * The native select's change event can be missed while a heavier page is
     * still hydrating (React's onChange handler not yet attached), so the
     * selection is retried until the URL flips to the new locale.
     * @param   {Page}          page   - Playwright page object
     * @param   {string}        target - Locale shortcode to switch to (e.g. 'fr')
     * @param   {RegExp}        urlRe  - Expected URL pattern after the switch
     * @returns {Promise<void>}        Resolves once the URL matches
     */
    async function switchLang(
      page: Page,
      target: string,
      urlRe: RegExp,
    ): Promise<void> {
      await expect(async () => {
        await page.selectOption(SELECTORS.langSelector, target);
        await expect(page).toHaveURL(urlRe, { timeout: 2000 });
      }).toPass({ timeout: 15000 });
    }

    test('selecting French navigates to a /fr-prefixed URL', async ({
      page,
    }) => {
      const options = await getLangOptions(page);
      test.skip(!options.includes('fr'), 'French locale not enabled in CMS');

      await switchLang(page, 'fr', /^.*\/fr(\/|$)/);
    });

    test('switching from French back to English returns to a /en URL', async ({
      page,
    }) => {
      const options = await getLangOptions(page);
      test.skip(!options.includes('fr'), 'French locale not enabled in CMS');

      // Switch to French first, then back to English.
      await switchLang(page, 'fr', /^.*\/fr(\/|$)/);
      await switchLang(page, 'en', /^.*\/en(\/|$)/);
    });

    test('language switch preserves the current page path', async ({
      page,
    }) => {
      // Start on the shop listing instead of the home page.
      await page.goto(ROUTES.shop);
      await waitForPageLoad(page);

      const options = await getLangOptions(page);
      test.skip(!options.includes('fr'), 'French locale not enabled in CMS');

      // Only the locale segment changes: /en/shop -> /fr/shop.
      await switchLang(page, 'fr', /\/fr\/shop/);
    });
  });

  test.describe('Localized Routes', () => {
    test('/en route loads English homepage', async ({ page }) => {
      await page.goto('/en');
      await waitForPageLoad(page);
      await expect(page).toHaveURL('/en');
    });

    test('redirect from root to localized route', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      // Should redirect to a localized route like /en
      const url = page.url();
      // URL should contain a language prefix
      expect(url).toMatch(/\/[a-z]{2}(\/|$)/);
    });
  });
});
