'use client';

import Link from 'next/link';
import type { FC } from 'react';

import HomeIcon from '@/components/icons/home';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NavItemHome: FC<{ item: any; lang: string }> = ({ item, lang }) => {
  const { pageUrl, localizeInfos } = item;
  return (
    <Link
      href={'/' + lang + '/' + pageUrl}
      title={localizeInfos.menuTitle}
      className="group relative box-border flex size-6 shrink-0 flex-col"
    >
      <HomeIcon />
    </Link>
  );
};

export default NavItemHome;
