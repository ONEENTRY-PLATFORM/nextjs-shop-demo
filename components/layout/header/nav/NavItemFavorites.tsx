'use client';

import Link from 'next/link';
import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import type { JSX } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { selectFavoritesItems } from '@/app/store/reducers/FavoritesSlice';
import { useHydrated } from '@/components/hooks/useHydrated';
import FavoritesAltIcon from '@/components/icons/favorites';

/**
 * Navigation item favorites link component for accessing the user's favorite products.
 * Renders a favorites icon that links to the favorites page with a badge showing the count.
 * @param   {object}      props      - component props.
 * @param   {IMenusPages} props.item - menu item.
 * @param   {string}      props.lang - current language shortcode.
 * @returns {JSX.Element}            JSX.Element.
 */
const NavItemFavorites = ({
  item,
  lang,
}: {
  item: IMenusPages;
  lang: string;
}): JSX.Element => {
  /**
   * Get favorites count from Redux favorites reducer
   * Gets the array of favorite product IDs and returns its length
   */
  const count = useAppSelector((state) => {
    const favorites = selectFavoritesItems(state);
    return favorites.length;
  });

  /**
   * Favorites live in a redux-persist store hydrated from localStorage, so the
   * count is only known on the client. Render `0` during SSR and the first
   * client render (to match the server HTML), then switch to the real count
   * once hydrated — otherwise React throws a hydration mismatch.
   */
  const hydrated = useHydrated();
  const displayCount = hydrated ? count : 0;

  /**
   * Destructure page URL and localized information from the menu item
   * pageUrl is used for navigation and localizeInfos contains the menu title
   */
  const { pageUrl, localizeInfos } = item;

  return (
    /**
     * Link to the favorites page with favorites icon and item count badge
     * Uses relative positioning to place the count badge in the top-right corner
     */
    <Link
      href={'/' + lang + '/' + pageUrl}
      title={localizeInfos?.menuTitle as string}
      className="group relative box-border flex size-8 shrink-0 flex-col max-sm:size-6"
      aria-label={`Favorites with ${displayCount} ${displayCount === 1 ? 'item' : 'items'}`}
      // test id for e2e testing
      data-testid="favorites-icon"
    >
      {/** Favorites icon component. Visual representation of the favorites functionality */}
      <FavoritesAltIcon />
      {/** Badge displaying the number of items in favorites */}
      <div
        className="absolute -top-1 -right-1.5 z-10 size-4 rounded-full bg-orange-500 text-center text-xs leading-4 text-white"
        aria-live="polite"
        aria-atomic="true"
        // test id for e2e testing
        data-testid="favorites-badge"
      >
        {displayCount}
      </div>
    </Link>
  );
};

export default NavItemFavorites;
