'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import type { JSX } from 'react';

import { LanguageEnum } from '@/app/types/enum';

/**
 * Footer menu item component for rendering individual navigation links in the footer.
 * Displays a single menu item with localized title and active state styling.
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
  /**
   * Get current pathname from Next.js router
   * Used to determine if this menu item is currently active
   */
  const paths = usePathname();

  /**
   * Return empty fragment if no page data is provided
   * Prevents rendering invalid menu items
   */
  if (!page) {
    return <></>;
  }

  /**
   * Convert language shortcode to language enum value
   * This is used to access localized menu item titles
   */
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  /**
   * Determine if this menu item is currently active
   * Compares current path with the menu item's target path
   */
  const isActive = paths === '/' + lang + '/' + page.pageUrl;

  return (
    /**
     * List item container for the menu link
     * Uses relative positioning and box-border for proper layout
     */
    <li className="relative box-border">
      {/** Navigation link with conditional styling based on active state. Changes color when hovered or when active */}
      <Link
        className={
          'hover:text-red-500 font-normal ' + (isActive ? 'text-red-500' : '')
        }
        href={'/' + lang + '/' + page.pageUrl}
      >
        {/** Display localized menu title or fallback to default title */}
        {page.localizeInfos[langCode]?.menuTitle ||
          page.localizeInfos?.menuTitle}
      </Link>
    </li>
  );
};

export default MenuItem;
