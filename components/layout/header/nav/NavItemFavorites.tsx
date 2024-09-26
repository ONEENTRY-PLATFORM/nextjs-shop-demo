'use client';

import Link from 'next/link';
import type { FC } from 'react';

import FavoritesIcon from '@/components/icons/favorites';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NavItemFavorites: FC<{ item: any }> = ({ item }) => {
  const { pageUrl, localizeInfos } = item;
  return (
    <Link
      href={'/' + pageUrl}
      title={localizeInfos.menuTitle}
      className="group relative box-border flex size-6 shrink-0 flex-col"
    >
      <FavoritesIcon />
    </Link>
  );
};

export default NavItemFavorites;
