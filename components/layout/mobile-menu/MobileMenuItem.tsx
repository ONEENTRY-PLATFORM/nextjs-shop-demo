'use client';

import Link from 'next/link';
import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import { useContext, useState } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

import MobileMenu from './MobileMenu';

function MobileMenuItem({ item }: { item: IMenusPages }) {
  const { setOpen } = useContext(OpenDrawerContext);
  const hasChild = Array.isArray(item.children) && item.children.length > 0;
  const href =
    item.pageUrl === 'category'
      ? '/shop/category/'
      : '/shop/category/' + item.pageUrl;
  const [openSubmenu, setOpenSubmenu] = useState(false);

  return (
    <li
      key={item.localizeInfos.menuTitle}
      className={
        'flex w-full flex-col py-2 text-lg text-slate-700 transition-colors hover:text-orange-500'
      }
    >
      <Link
        className={'flex ' + (hasChild && '')}
        href={href}
        prefetch={true}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(false);
        }}
      >
        {item.localizeInfos.menuTitle}
        {hasChild && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpenSubmenu(!openSubmenu);
            }}
            className="ml-auto"
          >
            v
          </button>
        )}
      </Link>
      {Array.isArray(item.children) && hasChild && (
        <MobileMenu
          menu={item.children}
          className={'px-2 ' + (!openSubmenu ? 'hidden' : 'visible')}
        />
      )}
    </li>
  );
}

export default MobileMenuItem;
