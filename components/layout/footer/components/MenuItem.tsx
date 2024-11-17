'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import type { FC } from 'react';

import { LanguageEnum } from '@/app/types/enum';

interface MenuItemProps {
  page: IMenusPages;
  lang: string;
}

/**
 * Footer menu item
 * @param page Represents a page object.
 * @param lang Current language shortcode
 *
 * @returns menu item
 */
const MenuItem: FC<MenuItemProps> = ({ page, lang }) => {
  const paths = usePathname();
  if (!page) {
    return;
  }
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const isActive = paths === '/' + lang + '/' + page.pageUrl;

  return (
    <li className="relative box-border">
      <Link
        prefetch={true}
        className={'hover:text-red-500 ' + (isActive ? 'text-red-500' : '')}
        href={'/' + lang + '/' + page.pageUrl}
      >
        {page.localizeInfos[langCode]?.menuTitle ||
          page.localizeInfos?.menuTitle}
      </Link>
    </li>
  );
};

export default MenuItem;
