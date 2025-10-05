'use client';

import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import type { JSX, Key } from 'react';

import MobileMenuItem from './MobileMenuItem';

/**
 * Mobile menu list
 * @param   {object}        props             - Component props
 * @param   {IMenusPages[]} props.menu        - Represents a menu - array of objects.
 * @param   {string}        [props.className] - CSS className of ref element
 * @param   {string}        props.lang        - Current language shortcode
 * @returns {JSX.Element}                     Mobile menu list
 */
function MobileMenu({
  menu,
  className,
  lang,
}: {
  menu: IMenusPages[];
  className?: string;
  lang: string;
}): JSX.Element {
  return Array.isArray(menu) && menu.length > 1 ? (
    <ul className={'flex flex-col ' + className}>
      {menu.map((item: IMenusPages, index: Key) => (
        <MobileMenuItem key={index} item={item} lang={lang} />
      ))}
    </ul>
  ) : (
    <div>Menu not available</div>
  );
}

export default MobileMenu;
