'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import type { JSX } from 'react';

import * as icons from '../../../icons';

/**
 * Sidebar menu item component that represents a single navigation item in the sidebar.
 * This component displays a link with an icon and localized title, and handles active state styling.
 * @param   {object}                              props          - The props object.
 * @param   {IMenusPages & { isActive: boolean }} props.menuItem - Menu item containing page URL and localized information.
 * @param   {string}                              props.lang     - Current language shortcode for URL construction.
 * @returns {JSX.Element}                                        - SidebarMenuItem component with link, icon and title.
 */
const SidebarMenuItem = ({
  menuItem,
  lang,
}: {
  menuItem: IMenusPages & { isActive: boolean };
  lang: string;
}): JSX.Element => {
  /** Get current pathname to determine active menu item */
  const paths = usePathname();
  const pathNames = paths.split('/').filter((path: unknown) => path);

  /** Return empty fragment if no menu item is provided */
  if (!menuItem) {
    return <></>;
  }

  /** Extract page URL and localized information from menu item */
  const { pageUrl, localizeInfos } = menuItem;

  /** Get the appropriate icon component based on page URL */
  const Icon = icons[pageUrl as keyof typeof icons];

  /** Determine if this menu item is currently active based on URL */
  const isActive = menuItem.pageUrl === pathNames[1];

  return (
    <li>
      <Link
        prefetch={true}
        className={`sidebar-menu-item ${clsx(isActive && 'text-orange-500')} group`}
        href={'/' + lang + '/' + pageUrl}
        aria-checked={isActive}
      >
        <div className="my-auto aspect-square size-4 shrink-0">
          <Icon active={isActive} />
        </div>
        <div>{localizeInfos.menuTitle}</div>
      </Link>
    </li>
  );
};

export default SidebarMenuItem;
