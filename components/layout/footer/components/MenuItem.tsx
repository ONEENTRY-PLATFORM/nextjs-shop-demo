'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import type { JSX } from 'react';

import { LanguageEnum } from '@/app/types/enum';

/**
 * Footer menu item.
 * @param   {object}      props      - Menu item props.
 * @param   {IMenusPages} props.page - Represents a page object.
 * @param   {string}      props.lang - Current language shortcode.
 * @returns {JSX.Element}            menu item.
 */
const MenuItem = ({
  page,
  lang,
}: {
  page: IMenusPages;
  lang: string;
}): JSX.Element => {
  const paths = usePathname();
  if (!page) {
    return <></>;
  }
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const isActive = paths === '/' + lang + '/' + page.pageUrl;

  return (
    <li className="relative box-border">
      <Link
        className={
          'hover:text-red-500 font-normal ' + (isActive ? 'text-red-500' : '')
        }
        href={'/' + lang + '/' + page.pageUrl}
      >
        {page.localizeInfos[langCode]?.menuTitle ||
          page.localizeInfos?.menuTitle}
      </Link>
    </li>
  );
};

export default MenuItem;
