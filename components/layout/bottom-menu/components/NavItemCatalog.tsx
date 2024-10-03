'use client';

import Link from 'next/link';
import type { FC } from 'react';

import CatalogIcon from '@/components/icons/catalog';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NavItemCatalog: FC<{ item: any; lang: string }> = ({ item, lang }) => {
  const { pageUrl, localizeInfos } = item;
  return (
    <Link
      href={'/' + lang + '/' + pageUrl}
      title={localizeInfos.menuTitle}
      className="group relative box-border flex size-6 shrink-0 flex-col"
    >
      <CatalogIcon />
    </Link>
  );
};

export default NavItemCatalog;
