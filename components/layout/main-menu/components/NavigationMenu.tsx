import Link from 'next/link';
import type { IMenusPages } from 'oneentry/types';
import type { JSX } from 'react';

import NavigationMenuItem from './NavigationMenuItem';

/**
 * Main navigation menu component.
 * Renders the top-level navigation menu with support for dropdown submenus.
 * @param   {object}               props      - Component properties
 * @param   {string}               props.lang - Current language shortcode (e.g., 'en', 'ru')
 * @param   {IMenusPages[]}        props.menu - Array of menu items with localized information
 * @returns {Promise<JSX.Element>}            Main navigation menu with dropdown capabilities
 */
const NavigationMenu = async ({
  lang,
  menu,
}: {
  lang: string;
  menu: IMenusPages[];
}): Promise<JSX.Element> => {
  return (
    <nav className="fade-in text-foreground relative z-20 items-center justify-center bg-white px-5 text-lg font-bold uppercase max-lg:text-sm max-md:hidden max-md:px-5 max-md:text-sm md:flex">
      {/* Main container for the navigation menu */}
      <div className="flex w-full max-w-(--breakpoint-xl) items-center justify-center py-5 max-md:px-5">
        {/* List of top-level menu items */}
        <ul className="flex w-full justify-between gap-5 max-md:flex-wrap">
          {menu?.map((item: IMenusPages) => {
            /**
             * The API returns a `children` key on every page — an empty array
             * for leaf items. Only treat a NON-empty array as a dropdown,
             * otherwise every item would get an arrow and an empty submenu.
             */
            const children = Array.isArray(item.children) ? item.children : [];
            const hasDropdown = children.length > 0;

            return (
              <li
                key={item.id}
                className="group my-auto flex justify-between gap-5 py-1 whitespace-nowrap"
              >
                {/* Navigation menu item with potential dropdown */}
                <NavigationMenuItem
                  label={item.localizeInfos.menuTitle as string}
                  href={'/' + lang + '/shop/' + item.pageUrl}
                  hasDropdown={hasDropdown}
                />

                {/* Dropdown submenu for items that have children */}
                {hasDropdown && (
                  <ul className="absolute z-10 mt-8 hidden flex-col gap-3 rounded-b-2xl bg-white p-6 leading-8 shadow-lg group-hover:flex">
                    {children.map((it: IMenusPages) => {
                      return (
                        <li key={it.id}>
                          {/* Link to the submenu category page */}
                          <Link
                            prefetch={true}
                            href={'/' + lang + '/shop/category/' + it.pageUrl}
                            className="transition-colors duration-300 ease-in-out hover:text-red-500 focus:outline-none"
                          >
                            {it.localizeInfos.menuTitle}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default NavigationMenu;
