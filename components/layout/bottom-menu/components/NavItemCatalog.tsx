'use client';

import Link from 'next/link';
import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import type { JSX } from 'react';

import CatalogIcon from '@/components/icons/catalog';

/**
 * Catalog navigation menu item component for the bottom mobile menu
 * Renders a link to the catalog/shop page with a catalog icon
 * Uses localized menu title as the link title attribute for accessibility
 * Responsive sizing for different screen sizes (larger on desktop, smaller on mobile)
 * @param   {object}      props      - Navigation item component props
 * @param   {IMenusPages} props.item - Menu page object containing URL and localized information
 * @param   {string}      props.lang - Current language shortcode for URL localization
 * @returns {JSX.Element}            Catalog navigation item link with icon
 */
const NavItemCatalog = ({
  item: { pageUrl, localizeInfos },
  lang,
}: {
  item: IMenusPages;
  lang: string;
}): JSX.Element => {
  return (
    /** Link to the catalog/shop page with localized title attribute for accessibility */
    <Link
      href={'/' + lang + '/' + pageUrl}
      title={localizeInfos.menuTitle}
      className="group relative box-border flex size-8 shrink-0 flex-col max-sm:size-6"
    >
      {/** Catalog icon component */}
      <CatalogIcon />
    </Link>
  );
};

export default NavItemCatalog;
