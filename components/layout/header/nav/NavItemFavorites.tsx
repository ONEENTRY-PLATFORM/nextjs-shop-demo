'use client';

import Link from 'next/link';
import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { selectFavoritesItems } from '@/app/store/reducers/FavoritesSlice';
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
   * State to store the favorites item count
   * This is updated when the favorites reducer data changes
   */
  const [count, setCount] = useState(0);

  /**
   * Get favorites count from Redux favorites reducer
   * Gets the array of favorite product IDs and returns its length
   */
  const favoritesCount = useAppSelector((state) => {
    const favorites = selectFavoritesItems(state);
    return favorites.length;
  });

  /**
   * Update local count state when favoritesCount changes
   * This effect ensures the displayed count stays in sync with the Redux store
   */
  useEffect(() => {
    setCount(favoritesCount);
  }, [favoritesCount]);

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
      title={localizeInfos?.menuTitle}
      className="group relative box-border flex size-8 shrink-0 flex-col max-sm:size-6"
      // test id for e2e testing
      data-testid="favorites-icon"
    >
      {/** Favorites icon component. Visual representation of the favorites functionality */}
      <FavoritesAltIcon />
      {/** Badge displaying the number of items in favorites */}
      <div
        className="absolute -top-1 -right-1.5 z-10 size-4 rounded-full bg-orange-500 text-center text-xs leading-4 text-white"
        // test id for e2e testing
        data-testid="favorites-badge"
      >
        {count}
      </div>
    </Link>
  );
};

export default NavItemFavorites;
