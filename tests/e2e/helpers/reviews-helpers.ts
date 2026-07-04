import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { ROUTES } from '../settings';
import { waitForPageLoad } from './navigation-helpers';

/**
 * Helper functions for the product reviews / comments flow.
 *
 * Reviews have NO data-testid hooks, so these helpers anchor on the stable,
 * hardcoded English strings the components render ("Leave review", "Leave
 * answer", "View all reviews") and on structural selectors verified against the
 * source (the chevron `svg[width="26"]` inside RatingButton, the hidden
 * `#rating` input inside StarRating, `input[name="comment_text"]` in CommentForm).
 *
 * ⚠️ The whole reviews block — the "Leave review" button (RatingBlock) and the
 * reviews list — is wrapped in a GSAP `ReviewAnimations` wrapper that starts
 * COLLAPSED (`autoAlpha:0`, `height:0`). Only the RatingButton toggle is visible
 * on load; everything else is `visibility:hidden` until the toggle is clicked.
 * So every interaction must expand the section first via {@link expandReviewsList}.
 */
export const REVIEWS = {
  /** Shared drawer host that all forms (incl. ReviewForm/ReviewModal) render into. */
  drawer: '#modalBody',
  /** RatingBlock "Leave review" trigger (hardcoded EN text) that opens the drawer. */
  leaveReviewText: 'Leave review',
  /** RatingButton chevron — clicking its button expands the reviews list. */
  toggleChevron: 'svg[width="26"][height="14"]',
  /** AnswerButton toggle present once per review card. */
  answerText: 'Leave answer',
  /** ViewAllButton, shown only when a product has more than 2 parent reviews. */
  viewAllText: 'View all reviews',
} as const;

/**
 * Locator for the RatingButton toggle (the only reviews control visible on load).
 * @param   {Page}    page - Playwright page object
 * @returns {Locator}      Locator for the collapsible toggle button
 */
export function getReviewsToggle(page: Page): Locator {
  return page.locator(`button:has(${REVIEWS.toggleChevron})`).first();
}

/**
 * The "Leave review" trigger (RatingBlock). While collapsed it is present but
 * `visibility:hidden`; it becomes visible once the section is expanded.
 *
 * The ReviewForm submit button shares the label, but lives in the drawer
 * (portaled to end of `<body>`), so `.first()` is the page trigger by DOM order.
 * @param   {Page}    page - Playwright page object
 * @returns {Locator}      Locator for the trigger button
 */
export function getLeaveReviewTrigger(page: Page): Locator {
  return page.getByRole('button', { name: REVIEWS.leaveReviewText }).first();
}

/**
 * Navigate to a product page and confirm the reviews section rendered.
 *
 * The product route returns HTTP 200 even for a missing/unpublished product
 * (it renders the 404 UI), so a spec must verify the reviews UI is actually
 * present rather than trust the status code. The RatingButton toggle is the
 * only reviews control on the page before expansion, so it is the signal.
 * @param   {Page}             page        - Playwright page object
 * @param   {string}           [productId] - Product id path segment (default: the ROUTES fixture)
 * @returns {Promise<boolean>}             True when the reviews toggle is on the page
 */
export async function goToProductReviews(
  page: Page,
  productId?: string,
): Promise<boolean> {
  await page.goto(productId ? `/en/shop/product/${productId}` : ROUTES.product);
  await waitForPageLoad(page);

  return getReviewsToggle(page)
    .waitFor({ state: 'visible', timeout: 25000 })
    .then(() => true)
    .catch(() => false);
}

/**
 * Expand the collapsible reviews section so its content (the "Leave review"
 * button, review cards, empty state) becomes visible. Idempotent: it no-ops when
 * the section is already expanded, so it never accidentally collapses it.
 * @param   {Page}          page - Playwright page object
 * @returns {Promise<void>}      Resolves once "Leave review" is visible
 */
export async function expandReviewsList(page: Page): Promise<void> {
  const leave = getLeaveReviewTrigger(page);
  if (await leave.isVisible().catch(() => false)) {
    return; // already expanded
  }
  const toggle = getReviewsToggle(page);
  await toggle.scrollIntoViewIfNeeded();
  // RatingButton toggles state (setState(!state)), so a blind retry-click would
  // COLLAPSE a section that expanded slowly under load. Only click while still
  // collapsed; once "Leave review" is visible, stop without re-clicking.
  await expect(async () => {
    if (!(await leave.isVisible().catch(() => false))) {
      await toggle.click();
    }
    await expect(leave).toBeVisible({ timeout: 4000 });
  }).toPass({ timeout: 20000 });
  // Let the expand height/translate animation settle so a follow-up click on a
  // freshly-revealed control doesn't race a still-moving element.
  await page.waitForTimeout(600);
}

/**
 * Expand the section and open the review form drawer via "Leave review".
 * @param   {Page}          page - Playwright page object
 * @returns {Promise<void>}      Resolves when the drawer is visible
 */
export async function openReviewForm(page: Page): Promise<void> {
  await expandReviewsList(page);
  const trigger = getLeaveReviewTrigger(page);
  await trigger.scrollIntoViewIfNeeded();
  const drawer = page.locator(REVIEWS.drawer);
  // "Leave review" toggles the drawer (setOpen(!open)), so a blind retry-click
  // would CLOSE a drawer that opened slowly under load — the root cause of the
  // intermittent openReviewForm timeouts. Click only while the drawer is not yet
  // open; once it is visible, stop.
  await expect(async () => {
    if (!(await drawer.isVisible().catch(() => false))) {
      await trigger.click();
    }
    await expect(drawer).toBeVisible({ timeout: 4000 });
  }).toPass({ timeout: 25000 });
}

/**
 * Locator for the per-review "Leave answer" toggles — a reliable one-per-card
 * proxy for the number of top-level review cards currently displayed.
 * @param   {Page}    page - Playwright page object
 * @returns {Locator}      Locator matching every "Leave answer" button
 */
export function getReviewAnswerButtons(page: Page): Locator {
  return page.getByRole('button', { name: REVIEWS.answerText });
}
