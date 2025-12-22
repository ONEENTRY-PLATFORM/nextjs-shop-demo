'use client';

import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import type { JSX } from 'react';

import MobileMenuItem from './MobileMenuItem';

/**
 * Mobile menu list component.
 * Renders a vertical list of menu items for mobile navigation.
 * @param   {object}        props             - Component properties
 * @param   {IMenusPages[]} props.menu        - Array of menu items with localized information
 * @param   {string}        [props.className] - Optional CSS className to apply to the container
 * @param   {string}        props.lang        - Current language shortcode (e.g., 'en', 'ru')
 * @returns {JSX.Element}                     A vertical list of mobile menu items or a "not available" message
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
  /** Check if menu is an array and has more than one item, then render the menu list */
  return Array.isArray(menu) && menu.length > 1 ? (
    /** Container for mobile menu items with flex column layout */
    <ul className={'flex flex-col ' + className}>
      {/* Map through menu items and render each as a MobileMenuItem component */}
      {menu.map((item: IMenusPages) => (
        <MobileMenuItem key={item.id} item={item} lang={lang} />
      ))}
    </ul>
  ) : (
    /** Display fallback message if menu is not available or has insufficient items */
    <div>Menu not available</div>
  );
}

export default MobileMenu;
