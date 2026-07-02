/** Product cards per catalog page limit. */
export const SHOP_PAGE_LIMIT = 8;

/** Id of the OneEntry product representing delivery. */
export const DELIVERY_PRODUCT_ID = 1828;

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
