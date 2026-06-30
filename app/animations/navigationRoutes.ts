/**
 * Helpers for classifying the destination of a client-side navigation, shared
 * by the transition overlay ({@link ./RouteSkeleton.tsx RouteSkeleton}) and the
 * transition provider ({@link ./TransitionProvider.tsx TransitionProvider}).
 */

/** Routes rendered inside the WithSidebar layout (sidebar + content). */
const SIDEBAR_ROUTES = ['cart', 'favorites', 'orders', 'profile', 'payment'];

/**
 * Normalize a navigation target (an absolute URL, a relative href, or a path
 * with a query string) down to the path segments after the locale prefix.
 * @param   {string | null} target - The pending navigation href.
 * @returns {string[]}             Path segments without the locale, e.g.
 *                                 `/en/shop/product/83` → `['shop','product','83']`.
 */
export const getSubSegments = (target: string | null): string[] => {
  if (!target) {
    return [];
  }

  let pathname = target;
  try {
    /** Resolve against the current origin to strip protocol/host and query. */
    pathname = new URL(target, window.location.origin).pathname;
  } catch {
    /** Fall back to the raw string (strip query manually). */
    pathname = target.split('?')[0] ?? target;
  }

  /** Drop the leading locale segment (`en`, `fr`, …). */
  const [, ...rest] = pathname.split('/').filter(Boolean);
  return rest;
};

/**
 * Whether the given target route is rendered with the left sidebar menu.
 * @param   {string | null} target - The pending navigation href.
 * @returns {boolean}              True for cart / favorites / orders / profile.
 */
export const isSidebarRoute = (target: string | null): boolean => {
  return SIDEBAR_ROUTES.includes(getSubSegments(target).join('/'));
};
