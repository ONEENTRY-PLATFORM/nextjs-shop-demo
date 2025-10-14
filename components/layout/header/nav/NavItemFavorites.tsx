'use client';

import Link from 'next/link';
import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import type { JSX } from 'react';

import FavoritesAltIcon from '@/components/icons/favorites';

/**
 * Navigation item favorites link component for accessing the user's favorite products.
 * Renders a favorites icon that links to the favorites page.
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
   * Destructure page URL and localized information from the menu item
   * pageUrl is used for navigation and localizeInfos contains the menu title
   */
  const { pageUrl, localizeInfos } = item;

  return (
    /**
     * Link to the favorites page with favorites icon
     * Uses relative positioning for proper icon alignment and responsive sizing
     */
    <Link
      href={'/' + lang + '/' + pageUrl}
      title={localizeInfos?.menuTitle}
      className="group relative box-border flex size-8 shrink-0 flex-col max-sm:size-6"
    >
      {/** Favorites icon component. Visual representation of the favorites functionality */}
      <FavoritesAltIcon />
    </Link>
  );
};

export default NavItemFavorites;
