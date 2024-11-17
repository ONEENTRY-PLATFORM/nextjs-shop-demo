import Link from 'next/link';
import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import type { FC, Key } from 'react';

import NavigationMenuItem from './NavigationMenuItem';

interface MainMenuProps {
  lang: string;
  menu: IMenusPages[];
}

/**
 * Main navigation menu
 * @param lang Current language shortcode
 * @param menu Represents a menu array of objects.
 *
 * @returns Main navigation menu
 */
const NavigationMenu: FC<MainMenuProps> = async ({ lang, menu }) => {
  return (
    <nav className="fade-in relative z-20 items-center justify-center bg-white px-5 text-lg font-bold uppercase text-neutral-600 max-lg:text-sm max-md:hidden max-md:px-5 max-md:text-sm md:flex">
      <div className="flex w-full max-w-screen-xl items-center justify-center py-5 max-md:px-5">
        <ul className="flex w-full justify-between gap-5 max-md:flex-wrap">
          {menu.map((item: IMenusPages, index: Key) => (
            <li
              key={index}
              className="group my-auto flex justify-between gap-5 whitespace-nowrap py-1"
            >
              <NavigationMenuItem
                label={item.localizeInfos.menuTitle}
                href={'/' + lang + '/shop/' + item.pageUrl}
                hasDropdown={item.children ? true : false}
              />

              {Array.isArray(item.children) && (
                <ul className="absolute z-10 mt-8 hidden flex-col gap-3 rounded-b-2xl bg-white p-6 leading-8 shadow-lg group-hover:flex">
                  {item.children.map((it: IMenusPages, i: Key) => {
                    return (
                      <li key={i}>
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
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavigationMenu;
