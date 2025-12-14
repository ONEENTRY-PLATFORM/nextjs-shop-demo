'use client';

import Link from 'next/link';
import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import type { JSX } from 'react';
import { useContext, useState } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

import MobileMenu from './MobileMenu';

/**
 * Mobile menu list item component.
 * Renders a single menu item with support for nested submenus in mobile navigation.
 * @param   {object}      props      - Component properties
 * @param   {IMenusPages} props.item - Menu item object containing title and URL information
 * @param   {string}      props.lang - Current language shortcode (e.g., 'en', 'ru')
 * @returns {JSX.Element}            A mobile menu item with optional submenu toggle
 */
function MobileMenuItem({
  item,
  lang,
}: {
  item: IMenusPages;
  lang: string;
}): JSX.Element {
  /** Access the setOpen function from OpenDrawerContext to control menu visibility */
  const { setOpen } = useContext(OpenDrawerContext);

  /** Check if the menu item has child items (submenu) */
  const hasChild = Array.isArray(item.children) && item.children.length > 0;

  /** Construct the href for the menu item based on its page URL */
  const href =
    item.pageUrl === 'category'
      ? '/' + lang + '/shop/category/'
      : '/' + lang + '/shop/category/' + item.pageUrl;

  /** State to control the visibility of submenu items */
  const [openSubmenu, setOpenSubmenu] = useState(false);

  return (
    /* List item container with styling for mobile menu items */
    <li
      key={item.localizeInfos.menuTitle}
      className={
        'flex w-full flex-col py-2 text-lg text-slate-700 transition-colors hover:text-orange-500'
      }
    >
      {/* Link for the menu item with optional submenu toggle */}
      <Link
        className={'flex ' + (hasChild && '')}
        href={href}
        prefetch={true}
        onClick={(e) => {
          /** Prevent event from bubbling up to parent elements */
          e.stopPropagation();
          /** Close the mobile menu when a link is clicked */
          setOpen(false);
        }}
      >
        {/* Display the localized menu item title */}
        {item.localizeInfos.menuTitle}

        {/* Render submenu toggle button if item has children */}
        {hasChild && (
          <button
            onClick={(e) => {
              /** Prevent default button behavior and event bubbling */
              e.preventDefault();
              e.stopPropagation();
              /** Toggle the submenu visibility state */
              setOpenSubmenu(!openSubmenu);
            }}
            className="ml-auto"
          >
            {/* Dropdown arrow icon indicating submenu availability */}
            <svg
              width="27"
              height="15"
              viewBox="0 0 27 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="size-4.5 fill-current"
            >
              <path d="M12.8531 12.75L11.8278 13.8449L12.8531 14.805L13.8784 13.8449L12.8531 12.75ZM25.625 2.84488C26.2296 2.27863 26.2608 1.32939 25.6945 0.724704C25.1283 0.120017 24.1791 0.0888621 23.5744 0.655118L25.625 2.84488ZM0.0812407 2.84488L11.8278 13.8449L13.8784 11.6551L2.13183 0.655118L0.0812407 2.84488ZM13.8784 13.8449L25.625 2.84488L23.5744 0.655118L11.8278 11.6551L13.8784 13.8449Z"></path>
            </svg>
          </button>
        )}
      </Link>

      {/* Render submenu if item has children and they should be visible */}
      {Array.isArray(item.children) && hasChild && (
        <MobileMenu
          menu={item.children}
          lang={lang}
          className={'px-2 ' + (!openSubmenu ? 'hidden' : 'visible')}
        />
      )}
    </li>
  );
}

export default MobileMenuItem;
