import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import type { FC } from 'react';
import { type Key } from 'react';

import { getMenuByMarker } from '@/app/api';
import { useServerProvider } from '@/app/store/providers/ServerProvider';

import NavItemCart from '../header/nav/NavItemCart';
import NavItemFavorites from '../header/nav/NavItemFavorites';
import NavItemProfile from '../header/nav/NavItemProfile';
import { NavMenuLoader } from '../header/nav/NavMenuLoader';
import NavItemCatalog from './components/NavItemCatalog';
import NavItemHome from './components/NavItemHome';

/**
 * Bottom menu for mobile devices
 * @async
 * @returns bottom mobile menu JSX.Element
 */
const BottomMobileMenu: FC = async () => {
  const [lang] = useServerProvider('lang');

  // Get Menu by marker from api
  const { menu, isError } = await getMenuByMarker('bottom_web', lang);

  return (
    <div className="fixed bottom-0 z-50 my-auto hidden h-[60px] w-full items-center justify-between gap-10 bg-white p-4 max-xs:flex">
      {!isError && menu && Array.isArray(menu.pages) ? (
        menu.pages.map((item: IMenusPages, i: Key) => {
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

export default BottomMobileMenu;
