import type { Page } from '@playwright/test';

import { ROUTES } from '../settings';
import { waitForPageLoad } from './navigation-helpers';

/**
 * Runtime-discovery helpers that make the suite resilient to the hardcoded live
 * product fixture (`ROUTES.product`).
 *
 * The product route points at a real CMS product id; when that product is
 * removed/unpublished the page renders the shared not-found UI (HTTP 200), which
 * would otherwise mass-skip every reviews/product test. These helpers keep the
 * fast hardcoded path as the default and only reach for the catalog when the
 * fixture no longer resolves.
 */

/**
 * Unique, stable marker of the shared not-found UI (see app/[lang]/not-found.tsx).
 * Both the CMS-driven and the hardcoded fallback variants render a "Return home"
 * link, and it appears on no other page — so it is a reliable "this product does
 * not exist" signal even though the route replies with HTTP 200.
 */
const RETURN_HOME_NAME = /return home/i;

/**
 * Positive signal that a real product rendered: the product detail `<h1>` carries
 * `data-testid="product-title"` (see ProductDetails.tsx). It is absent from the
 * not-found UI, so it is the mutually-exclusive counterpart of the "Return home"
 * link. (Product cards also carry this testid, but the not-found page renders no
 * product cards, so its presence on this route still means "a product rendered".)
 */
const PRODUCT_TITLE_SELECTOR = '[data-testid="product-title"]';

/**
 * Reports whether the current page is the shared not-found UI rather than a real
 * product.
 *
 * Both outcomes stream in from RSC flight data slightly after
 * `domcontentloaded`, so a synchronous `count()` would race them (the "Return
 * home" link is only script text until the boundary hydrates). Instead this
 * waits for whichever mutually-exclusive signal appears first — the not-found
 * "Return home" link or a real product's title — so it stays fast on a valid
 * product too. `getByRole('link')` matches only live DOM links, never the
 * "Return home" string embedded in the flight payload of every page.
 * @param   {Page}             page - Playwright page object
 * @returns {Promise<boolean>}      True when the not-found UI is on the page
 */
export async function rendersNotFoundUI(page: Page): Promise<boolean> {
  const notFoundLink = page
    .getByRole('link', { name: RETURN_HOME_NAME })
    .first();
  const productTitle = page.locator(PRODUCT_TITLE_SELECTOR).first();

  await notFoundLink
    .or(productTitle)
    .first()
    .waitFor({ state: 'visible', timeout: 15000 })
    .catch(() => {
      // Neither appeared in time — treat as "not the not-found UI" so the caller
      // falls through rather than discovering off a page that never resolved.
    });

  return notFoundLink.isVisible().catch(() => false);
}

/**
 * Discovers a valid product id at runtime from the shop catalog.
 *
 * Navigates to the shop, waits for a real product card link (the skeleton loader
 * shares `.product-card` but has no product link), then parses the id out of the
 * first `/shop/product/<id>` href.
 * @param   {Page}                   page - Playwright page object
 * @returns {Promise<string | null>}      First product id, or null when none render
 */
export async function discoverProductId(page: Page): Promise<string | null> {
  await page.goto(ROUTES.shop);
  await waitForPageLoad(page);

  const firstProductLink = page
    .locator('.product-card a[href*="/shop/product/"]')
    .first();

  const rendered = await firstProductLink
    .waitFor({ state: 'visible', timeout: 20000 })
    .then(() => true)
    .catch(() => false);
  if (!rendered) {
    return null;
  }

  const href = await firstProductLink.getAttribute('href');
  const match = href?.match(/\/shop\/product\/(\d+)/);
  return match?.[1] ?? null;
}

/**
 * Resolves a product path that is guaranteed to render a real product.
 *
 * Returns `ROUTES.product` (the fast hardcoded fixture) when that page renders a
 * real product, leaving the page navigated there. Only when the fixture renders
 * the not-found UI does it fall back to a live product discovered from the
 * catalog (navigating there too). Falls back to `ROUTES.product` when discovery
 * also fails, so the caller always receives a usable path.
 * @param   {Page}            page - Playwright page object
 * @returns {Promise<string>}      A product path; the page is left navigated to it
 */
export async function resolveFixtureProductPath(page: Page): Promise<string> {
  await page.goto(ROUTES.product);
  await waitForPageLoad(page);

  // Fast path: 103 is a real product (no not-found marker) → keep the default.
  if (!(await rendersNotFoundUI(page))) {
    return ROUTES.product;
  }

  // Fallback: the fixture product was removed/unpublished — find a live one.
  const discovered = await discoverProductId(page);
  if (!discovered) {
    return ROUTES.product;
  }

  const path = `/en/shop/product/${discovered}`;
  await page.goto(path);
  await waitForPageLoad(page);
  return path;
}
