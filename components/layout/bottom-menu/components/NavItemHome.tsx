'use client';

import Link from 'next/link';
import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import type { FC } from 'react';

import HomeIcon from '@/components/icons/home';

/**
 * Home navItem menu element
 * @param item menu element object.
 * @param lang current language shortcode
 * @returns
 */
const NavItemHome: FC<{ item: IMenusPages; lang: string }> = ({
  item: { pageUrl, localizeInfos },
  lang,
}) => {
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
