'use client';

import Link from 'next/link';
import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import type { JSX } from 'react';

import HomeIcon from '@/components/icons/home';

/**
 * Home navItem menu element.
 * @param   {object}      props      - menu element props.
 * @param   {IMenusPages} props.item - menu element object.
 * @param   {string}      props.lang - current language shortcode.
 * @returns {JSX.Element}            home navItem menu element.
 */
const NavItemHome = ({
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
      <HomeIcon />
    </Link>
  );
};

export default NavItemHome;
