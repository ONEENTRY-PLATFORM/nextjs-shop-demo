import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import type { JSX } from 'react';
import { type Key } from 'react';

import { getMenuByMarker } from '@/app/api';
import { ServerProvider } from '@/app/store/providers/ServerProvider';

import NavItemCart from '../header/nav/NavItemCart';
import NavItemFavorites from '../header/nav/NavItemFavorites';
import NavItemProfile from '../header/nav/NavItemProfile';
import NavMenuLoader from '../header/nav/NavMenuLoader';
import NavItemCatalog from './components/NavItemCatalog';
import NavItemHome from './components/NavItemHome';

/**
 * Bottom menu component for mobile devices that displays navigation items at the bottom of the screen
 * Fetches menu data from the API based on the 'bottom_web' marker and renders navigation items
 * Conditionally renders different navigation components based on the pageUrl of each menu item
 * Only visible on extra small screens (max-xs) as a mobile-specific navigation solution
 * @returns {Promise<JSX.Element>} bottom mobile menu JSX.Element with navigation items
 */
const BottomMobileMenu = async (): Promise<JSX.Element> => {
  /** Get current language from server provider, default to 'en' */
  const [lang = 'en'] = ServerProvider<string>('lang');

  /** Fetch menu data from API using 'bottom_web' marker for mobile bottom menu */
  const { menu, isError } = await getMenuByMarker('bottom_web', lang);

  return (
    /** Fixed position container at the bottom of the screen for mobile navigation */
    <div className="fixed bottom-0 z-50 my-auto hidden h-15 w-full items-center justify-between gap-10 bg-white p-4 max-xs:flex">
      {/** Render navigation items if menu data is available and valid, otherwise show loader */}
      {!isError && menu && Array.isArray(menu.pages) ? (
        menu.pages.map((item: IMenusPages, i: Key) => {
          return (
            /** Container for each navigation item with fixed size */
            <div className="flex size-6" key={i}>
              {/** Render specific navigation component based on pageUrl */}
              {item.pageUrl === 'home' && (
                <NavItemHome item={item} lang={lang} />
              )}
              {item.pageUrl === 'shop' && (
                <NavItemCatalog item={item} lang={lang} />
              )}
              {item.pageUrl === 'profile' && (
                <NavItemProfile item={item} lang={lang} userMenu={menu} />
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
