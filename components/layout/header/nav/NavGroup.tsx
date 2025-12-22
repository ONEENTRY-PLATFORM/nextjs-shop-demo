import type {
  IMenusEntity,
  IMenusPages,
} from 'oneentry/dist/menus/menusInterfaces';
import type { JSX } from 'react';

import { getLocales, getMenuByMarker } from '@/app/api';

import LangSelector from './LangSelector';
import MenuButton from './MenuButton';
import NavItemCart from './NavItemCart';
import NavItemFavorites from './NavItemFavorites';
import NavItemProfile from './NavItemProfile';
import NavMenuLoader from './NavMenuLoader';

/**
 * User navigation group component for rendering the main navigation elements in the header.
 * Displays user-related navigation items such as profile, favorites, cart, along with language selector and mobile menu button.
 * @param   {object}               props      - component props.
 * @param   {string}               props.lang - current language shortcode.
 * @returns {Promise<JSX.Element>}            JSX.Element
 */
const NavGroup = async ({ lang }: { lang: string }): Promise<JSX.Element> => {
  /** Fetch available locales for language selection */
  const { locales } = await getLocales();

  /** Fetch user menu data for the web interface */
  const { menu, isError } = await getMenuByMarker('user_web', lang);

  /** Fetch side menu data for user profile dropdown */
  const userMenu = await getMenuByMarker('side_web', lang);

  /**
   * Return empty fragment if there's an error or user menu is not available
   * Prevents rendering invalid navigation elements
   */
  if (isError || !userMenu) {
    return <></>;
  }

  return (
    /**
     * Container for the navigation group with fade-in animation
     * Uses flex layout to arrange navigation items with responsive gaps
     */
    <div className="fade-in my-auto flex items-center gap-6 max-md:max-w-full max-md:gap-4 max-sm:gap-2">
      {/** Render navigation items if menu and pages are available */}
      {menu && Array.isArray(menu.pages) ? (
        menu.pages.map((item: IMenusPages) => {
          return (
            /** Container for individual navigation items with responsive sizing */
            <div
              className="flex size-8 max-sm:size-6 max-xs:hidden"
              key={item.id}
            >
              {item.pageUrl === 'profile' && (
                <NavItemProfile
                  item={item}
                  lang={lang}
                  userMenu={userMenu.menu as IMenusEntity}
                />
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
        /** Show navigation menu loader when menu data is not yet available */
        <NavMenuLoader />
      )}
      {/** Mobile menu trigger button */}
      <MenuButton />
      {/** Language selector dropdown */}
      {locales && <LangSelector locales={locales} lang={lang} />}
    </div>
  );
};

export default NavGroup;
