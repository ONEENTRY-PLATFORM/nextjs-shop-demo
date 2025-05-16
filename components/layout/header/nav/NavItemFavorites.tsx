'use client';

import Link from 'next/link';
import type { FC } from 'react';

import FavoritesAltIcon from '@/components/icons/favorites';

/**
 * Nav item favorites link
 * @param item
 * @param lang current language shortcode
 *
 * @returns JSX.Element
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NavItemFavorites: FC<{ item: any; lang: string }> = ({ item, lang }) => {
  const { pageUrl, localizeInfos } = item;
  return (
    <Link
      prefetch={true}
      href={'/' + lang + '/' + pageUrl}
      title={localizeInfos.menuTitle}
      className="group relative box-border flex size-8 shrink-0 flex-col max-sm:size-6"
    >
      <FavoritesAltIcon />
    </Link>
  );
};

export default NavItemFavorites;
