'use client';

import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import type { Key } from 'react';

import MobileMenuItem from './MobileMenuItem';

function MobileMenu({
  menu,
  className,
  lang,
}: {
  menu: IMenusPages[];
  className?: string;
  lang: string;
}) {
  return menu.length ? (
    <ul className={'flex flex-col ' + className}>
      {menu.map((item: IMenusPages, index: Key) => (
        <MobileMenuItem key={index} item={item} lang={lang} />
      ))}
    </ul>
  ) : null;
}

export default MobileMenu;
