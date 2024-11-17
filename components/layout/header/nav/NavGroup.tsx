import type {
  IMenusEntity,
  IMenusPages,
} from 'oneentry/dist/menus/menusInterfaces';
import type { FC } from 'react';
import { type Key } from 'react';

import { getLocales, getMenuByMarker } from '@/app/api';

import LangSelector from './LangSelector';
import MenuButton from './MenuButton';
import NavItemCart from './NavItemCart';
import NavItemFavorites from './NavItemFavorites';
import NavItemProfile from './NavItemProfile';
import { NavMenuLoader } from './NavMenuLoader';

/**
 * User navigation group
 * @param lang current language shortcode
 *
 * @returns JSX.Element
 */
const NavGroup: FC<{
  lang: string;
}> = async ({ lang }) => {
  const { locales } = await getLocales();
  const { menu, isError } = await getMenuByMarker('user_web', lang);
  const userMenu = await getMenuByMarker('side_web', lang);

  if (isError || !userMenu) {
    return;
  }

  return (
    <div className="fade-in my-auto flex items-center gap-10 max-md:max-w-full max-md:gap-4 max-sm:gap-2">
      {menu && Array.isArray(menu.pages) ? (
        menu.pages.map((item: IMenusPages, i: Key) => {
          return (
            <div className="flex size-6 max-xs:hidden" key={i}>
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
        <NavMenuLoader />
      )}
      <MenuButton />
      {locales && <LangSelector locales={locales} lang={lang} />}
    </div>
  );
};

export default NavGroup;
