/** Product cards per catalog page limit. */
export const SHOP_PAGE_LIMIT = 8;

/**
 * Placeholder shown wherever the CMS has no localized title.
 *
 * `localizeInfos.title` is optional content: a page or product can exist with
 * an empty localize record (product 14 is one such case in the live catalog).
 * Rendering the placeholder keeps the page usable — and its `<title>` non-empty
 * for accessibility — instead of collapsing to a blank string or a dead end.
 */
export const NO_TITLE = 'no title';

/** Site name used by the metadata title template and as the home-page default. */
export const SITE_NAME = 'OneEntry Shop';

/**
 * Id of the OneEntry product representing delivery.
 *
 * All call sites (cart page fetch, cart badge count, order product list,
 * repeat-order filter) must use this constant — never the literal id.
 * The value 83 is the id the runtime has always used; the previous constant
 * value 1828 was never imported anywhere and is recorded as an unresolved
 * discrepancy in `.claude/rules/mismatch-log.md` C.7.5 (pending verification
 * against the admin panel).
 */
export const DELIVERY_PRODUCT_ID = 83;

/**
 * OneEntry page markers (`pageUrl`).
 *
 * Used as arguments to `getPageByUrl` / `getChildPagesByParentUrl` / `getBlocksByPageUrl` / `getProductsByPageUrl`,
 * and to match `page.pageUrl` values returned by Menus API (see navigation dispatchers).
 */
export const PAGES = {
  home: 'home_web',
  shop: 'shop',
  notFound: '404',
  profile: 'profile',
  favorites: 'favorites',
  cart: 'cart',
} as const;

/** OneEntry menu markers — used by `getMenuByMarker`. */
export const MENUS = {
  mainWeb: 'main_web',
  userWeb: 'user_web',
  sideWeb: 'side_web',
} as const;
