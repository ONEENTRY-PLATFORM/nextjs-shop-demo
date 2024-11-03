import type { ILocalEntity } from 'oneentry/dist/locales/localesInterfaces';
import type { IMenusEntity } from 'oneentry/dist/menus/menusInterfaces';
import type { FC } from 'react';

import { getLocales, getMenuByMarker } from '@/app/api';
import { useServerProvider } from '@/app/store/providers/ServerProvider';

import Logo from './Logo';
import NavGroup from './nav/NavGroup';
import SearchBar from './search/SearchBar';

const Header: FC = async () => {
  const [lang] = useServerProvider('lang');
  const [dict] = useServerProvider('dict');
  const { menu, isError } = await getMenuByMarker('user_web', lang);
  const userMenu = await getMenuByMarker('side_web', lang);
  const { locales } = await getLocales();

  return (
    <header className="z-50 flex items-center justify-center bg-white px-5">
      <section className="mx-auto box-border flex w-full max-w-screen-xl grow flex-col justify-center self-stretch bg-white md:py-6 lg:py-10">
        <div className="flex w-full max-w-screen-xl justify-between gap-16 max-md:flex-wrap max-md:gap-6 max-sm:gap-4">
          <Logo lang={lang} />
          <SearchBar dict={dict} lang={lang} />
          {!isError && (
            <NavGroup
              lang={lang}
              menu={menu as IMenusEntity}
              userMenu={userMenu as unknown as IMenusEntity}
              locales={locales as ILocalEntity[]}
            />
          )}
        </div>
      </section>
    </header>
  );
};

export default Header;
