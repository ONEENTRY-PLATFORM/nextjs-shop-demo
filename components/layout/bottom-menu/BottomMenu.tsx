// BottomMenu
import type { FC } from 'react';
import { type Key } from 'react';

import { getMenuByMarker } from '@/app/api';
import { NavMenuLoader } from '@/components/shared/Loader';
import NavItemCart from '../header/nav/NavItemCart';
import NavItemFavorites from '../header/nav/NavItemFavorites';
import NavItemProfile from '../header/nav/NavItemProfile';
import NavItemHome from './components/NavItemHome';
import NavItemCatalog from './components/NavItemCatalog';

const BottomMenu: FC<{ lang: string }> = async ({ lang }) => {
  const { menu, isError } = await getMenuByMarker('bottom_web', lang);
  return (
    <div className="my-auto max-xs:flex items-center justify-between h-[60px] z-50 hidden gap-10 w-full fixed p-4 bottom-0 bg-white">
      {!isError && menu && Array.isArray(menu.pages) ? (
        menu.pages.map((item: { pageUrl: string }, i: Key) => {
          return (
            <div className="flex size-6" key={i}>
              {item.pageUrl === 'home_web' && (
                <NavItemHome item={item} lang={lang} />
              )}
              {item.pageUrl === 'shop' && (
                <NavItemCatalog item={item} lang={lang} />
              )}
              {item.pageUrl === 'profile' && (
                <NavItemProfile item={item} lang={lang} />
              )}
              {item.pageUrl === 'favorites' && (
                <NavItemFavorites item={item} lang={lang} />
              )}
              {item.pageUrl === 'cart' && (
                <NavItemCart item={item} lang={lang} />
              )}
            </div>
          );
        })
      ) : (
        <NavMenuLoader />
      )}
    </div>
  );
};

export default BottomMenu;
