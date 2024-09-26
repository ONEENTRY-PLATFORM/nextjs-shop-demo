'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import type { FC } from 'react';

const MenuItem: FC<{
  page: IMenusPages;
}> = ({ page }) => {
  const paths = usePathname();
  if (!page) {
    return;
  }
  const isActive = paths === '/' + page.pageUrl;

  return (
    <li className="relative box-border">
      <Link
        className={'hover:text-red-500 ' + (isActive ? 'text-red-500' : '')}
        href={'/' + page.pageUrl}
      >
        {page.localizeInfos.menuTitle}
      </Link>
    </li>
  );
};

export default MenuItem;
