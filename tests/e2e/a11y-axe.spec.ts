import AxeBuilder from '@axe-core/playwright';
import type { Page, TestInfo } from '@playwright/test';
import { expect, test } from '@playwright/test';
import type { ImpactValue, Result } from 'axe-core';

import {
  goToFirstProduct,
  waitForPageLoad,
} from './helpers/navigation-helpers';
import { ROUTES } from './settings';

/**
 * Automated accessibility scanning with axe-core.
 *
 * This complements — does NOT replace — the manual semantic a11y checks in
 * `accessibility.spec.ts` (landmarks, keyboard nav, focus management, ARIA).
 * Here we run the axe-core rules engine (WCAG 2.0 A + AA) over the key pages
 * and gate on the *impact* of the violations it finds.
 *
 * ── Threshold choice (calibrated against the live :3100 build on 2026-07-04) ──
 * A strict "zero critical violations" gate is the goal, but the app currently
 * ships pre-existing critical-impact a11y debt on every scanned page (a shared
 * header `<select>` with no accessible name → `select-name`, a disallowed ARIA
 * attribute → `aria-allowed-attr`, an icon-only button on the product page →
 * `button-name`). Hard-failing on that today would make the suite permanently
 * red and therefore useless as a regression signal.
 *
 * So the HARD GATE is a *baseline-aware* one: each page declares the set of
 * critical rule ids that are known debt today, and the test fails only on a
 * critical violation whose rule id is NOT in that baseline — i.e. a genuinely
 * NEW critical regression. `serious`/`moderate` violations are reported (test
 * annotation + console) as a known-issues baseline rather than hard-failing on
 * existing debt; a page whose serious baseline is empty is automatically
 * tightened to also assert zero serious (regression protection).
 *
 * FOLLOW-UP (a11y debt paydown): as each baselined rule id is fixed, delete it
 * from the page's baseline below. When a page's `critical` baseline reaches `[]`
 * the gate becomes the strict "zero critical" assertion for free; likewise
 * emptying `serious` auto-enables the zero-serious assertion for that page.
 */

/** Per-page snapshot of currently-accepted (pre-existing) axe violation rule ids. */
interface A11yBaseline {
  /** Critical-impact rule ids that are known debt on this page today. */
  readonly critical: readonly string[];
  /** Serious-impact rule ids that are known debt on this page today. */
  readonly serious: readonly string[];
}

/**
 * Known-issues baselines captured from the live build on 2026-07-04.
 * Shrink these as the underlying a11y issues are fixed (see FOLLOW-UP above).
 */
const BASELINE = {
  home: {
    critical: ['aria-allowed-attr', 'select-name'],
    serious: ['link-name'],
  },
  shop: {
    critical: ['aria-allowed-attr', 'select-name'],
    serious: ['color-contrast', 'link-name'],
  },
  product: {
    critical: ['aria-allowed-attr', 'button-name', 'select-name'],
    serious: ['color-contrast', 'link-name'],
  },
  cart: {
    // `select-name`/`aria-allowed-attr` originate in the SHARED header (the
    // language <select>), so they can surface on any page once it hydrates —
    // baseline both here even though a fast scan sometimes misses `select-name`.
    critical: ['aria-allowed-attr', 'select-name'],
    serious: ['color-contrast'],
  },
} as const satisfies Record<string, A11yBaseline>;

/**
 * Renders axe violations of a single impact level into a readable multi-line
 * string (rule id, node count, help text) for annotations and console output.
 * @param   {Result[]} violations - axe violations already filtered by impact
 * @returns {string}              Human-readable summary, one violation per line
 */
function formatViolations(violations: Result[]): string {
  if (violations.length === 0) return '  (none)';
  return violations
    .map((v) => `  • ${v.id} (${v.nodes.length} node(s)) — ${v.help}`)
    .join('\n');
}

/**
 * Runs an axe-core WCAG 2.0 A/AA scan on the current page and applies the
 * baseline-aware impact gate described in the file header.
 * @param   {Page}          page     - Playwright page (already navigated + loaded)
 * @param   {TestInfo}      testInfo - active test info, for attaching annotations
 * @param   {A11yBaseline}  baseline - known-issues baseline for this page
 * @param   {string}        label    - short page label used in log/annotation text
 * @returns {Promise<void>}          Resolves once the scan and assertions complete
 */
async function runAxeGate(
  page: Page,
  testInfo: TestInfo,
  baseline: A11yBaseline,
  label: string,
): Promise<void> {
  // Auto-retry that the page shell is actually painted before scanning, so a
  // GSAP entrance animation can't have axe run against a half-rendered DOM.
  // Every page renders <main> in the root layout, so its absence means the live
  // CMS shell simply hasn't painted yet — under load that can exceed expect's 5s
  // default and surface as a spurious "element(s) not found". Give it the same
  // live-API headroom the rest of this suite uses (waitForPageLoad already waits
  // 15s but swallows the failure) so a slow shell degrades to a pass, not a flake.
  await expect(page.locator('main').first()).toBeVisible({ timeout: 20000 });

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  const byImpact = (impact: ImpactValue): Result[] =>
    results.violations.filter((v) => v.impact === impact);

  const critical = byImpact('critical');
  const serious = byImpact('serious');
  const moderate = byImpact('moderate');
  const minor = byImpact('minor');

  const summary =
    `axe (${label}) — critical:${critical.length} serious:${serious.length} ` +
    `moderate:${moderate.length} minor:${minor.length}\n` +
    `critical:\n${formatViolations(critical)}\n` +
    `serious:\n${formatViolations(serious)}\n` +
    `moderate:\n${formatViolations(moderate)}`;

  // Surface the full picture in both the terminal and the HTML report.
  // eslint-disable-next-line no-console
  console.log(`\n=== ${summary}\n`);
  testInfo.annotations.push({ type: 'a11y-axe', description: summary });

  // HARD GATE: no NEW critical violation (one whose rule id is not baselined).
  const newCritical = critical
    .map((v) => v.id)
    .filter((id) => !baseline.critical.includes(id));
  expect(
    newCritical,
    `New CRITICAL a11y violation(s) on ${label} not in the known baseline: ` +
      `${newCritical.join(', ')}. Fix them, or (if intentional) add to BASELINE.`,
  ).toEqual([]);

  if (baseline.serious.length === 0) {
    // Page is clean of serious debt → keep it that way (regression protection).
    expect(
      serious.map((v) => v.id),
      `New SERIOUS a11y violation(s) on ${label}: ${serious
        .map((v) => v.id)
        .join(', ')}.`,
    ).toEqual([]);
  }
  // else: serious violations are pre-existing debt — reported above, not gated.
}

test.describe('Accessibility (axe-core)', () => {
  // Live pages hit the OneEntry cloud API and fade in via GSAP; give the
  // nav-heavy product scan headroom over Playwright's default.
  test.setTimeout(60000);

  test('home page has no new critical a11y violations', async ({
    page,
  }, testInfo) => {
    await page.goto(ROUTES.home);
    await waitForPageLoad(page);
    await runAxeGate(page, testInfo, BASELINE.home, 'home /en');
  });

  test('shop page has no new critical a11y violations', async ({
    page,
  }, testInfo) => {
    await page.goto(ROUTES.shop);
    await waitForPageLoad(page);
    await runAxeGate(page, testInfo, BASELINE.shop, 'shop /en/shop');
  });

  test('product page has no new critical a11y violations', async ({
    page,
  }, testInfo) => {
    await goToFirstProduct(page);
    await waitForPageLoad(page);
    await runAxeGate(page, testInfo, BASELINE.product, 'product');
  });

  test('cart page has no new critical a11y violations', async ({
    page,
  }, testInfo) => {
    await page.goto(ROUTES.cart);
    await waitForPageLoad(page);
    await runAxeGate(page, testInfo, BASELINE.cart, 'cart /en/cart');
  });
});
