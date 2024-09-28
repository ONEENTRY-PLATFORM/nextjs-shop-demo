import type { FC } from 'react';
import { type Key } from 'react';

import { getLocales, getMenuByMarker } from '@/app/api';
import { useServerProvider } from '@/app/store/providers/ServerProvider';
import { LanguageEnum } from '@/app/types/enum';
import { NavMenuLoader } from '@/components/shared/Loader';

import LangSelector from './LangSelector';
import MenuButton from './MenuButton';
import NavItemCart from './NavItemCart';
import NavItemFavorites from './NavItemFavorites';
import NavItemProfile from './NavItemProfile';

const NavGroup: FC = async () => {
  const [lang] = useServerProvider('lang');
  const [langCode] = useServerProvider('langCode');

  const { menu, isError } = await getMenuByMarker('user_web', langCode);
  const { locales } = await getLocales();

  return (
    <div className="my-auto flex items-center gap-10 max-md:max-w-full max-md:gap-4">
      {!isError && menu && Array.isArray(menu.pages) ? (
        menu.pages.map((item: { pageUrl: string }, i: Key) => {
          return (
            <div className="flex size-6" key={i}>
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
      <MenuButton />
      <LangSelector locales={locales} lang={lang} />
    </div>
  );
};

export default NavGroup;
