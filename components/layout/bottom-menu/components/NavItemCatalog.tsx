'use client';

import Link from 'next/link';
import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import type { JSX } from 'react';

import CatalogIcon from '@/components/icons/catalog';

/**
 * Catalog navigation menu item.
 * @param   {object}      props      - menu item props.
 * @param   {IMenusPages} props.item - menu element object.
 * @param   {string}      props.lang - current language shortcode.
 * @returns {JSX.Element}            menu item.
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
