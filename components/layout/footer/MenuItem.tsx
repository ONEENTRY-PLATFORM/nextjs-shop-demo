'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import type { FC } from 'react';

const MenuItem: FC<{
  page: IMenusPages;
  lang: string;
}> = ({ page, lang }) => {
  const paths = usePathname();
  if (!page) {
    return;
  }
  const isActive = paths === '/' + lang + '/' + page.pageUrl;

  return (
    <li className="relative box-border">
      <Link
        className={'hover:text-red-500 ' + (isActive ? 'text-red-500' : '')}
        href={'/' + lang + '/' + page.pageUrl}
      >
        {page.localizeInfos.menuTitle}
      </Link>
    </li>
  );
};

export default MenuItem;
