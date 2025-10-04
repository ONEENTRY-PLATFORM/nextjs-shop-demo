'use client';

import Link from 'next/link';
import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import type { JSX } from 'react';

import CatalogIcon from '@/components/icons/catalog';

/**
 * Catalog navigation menu item.
 *
 * @param props - menu item props.
 * @param props.item - menu element object.
 * @param props.item.pageUrl - page url.
 * @param props.item.localizeInfos - menu item localization info.
 * @param props.lang - current language shortcode.
 *
 * @returns menu item.
 */
const NavItemCatalog = ({
  item: { pageUrl, localizeInfos },
  lang,
}: {
  item: IMenusPages;
  lang: string;
}): JSX.Element => {
  return (
    <Link
      href={'/' + lang + '/' + pageUrl}
      title={localizeInfos.menuTitle}
      className="group relative box-border flex size-8 shrink-0 flex-col max-sm:size-6"
    >
      <CatalogIcon />
    </Link>
  );
};

export default NavItemCatalog;
