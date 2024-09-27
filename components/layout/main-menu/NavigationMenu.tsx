import Link from 'next/link';
import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import type { FC, Key } from 'react';
import { Suspense } from 'react';

import { getMenuByMarker } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { flatMenuToNested } from '@/components/utils';

import OffscreenModal from '../mobile-menu/OffscreenModal';
import NavigationMenuItem from './NavigationMenuItem';

const NavigationMenu: FC<{ lang: string }> = async ({ lang }) => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const { isError, menu } = await getMenuByMarker('main_web', langCode);
  if (!menu || !menu.pages || isError) {
    return;
  }

  const mainMenu = flatMenuToNested(
    Array.isArray(menu.pages) ? menu.pages : [],
    null,
  );

  return (
    <>
      <nav className="relative z-20 items-center justify-center bg-white px-5 text-lg font-bold uppercase text-neutral-600 max-lg:text-sm max-md:hidden max-md:px-5 max-md:text-sm md:flex">
        <div className="flex w-full max-w-screen-xl items-center justify-center py-5 max-md:px-5">
          <ul className="flex w-full justify-between gap-5 max-md:flex-wrap">
            {mainMenu.map((item: IMenusPages, index: Key) => (
              <li
                key={index}
                className="group my-auto flex justify-between gap-5 whitespace-nowrap py-1"
              >
                <NavigationMenuItem
                  label={item.localizeInfos.menuTitle}
                  href={'/' + lang + '/shop/' + item.pageUrl}
                  hasDropdown={item.children ? true : false}
                />

                {Array.isArray(item.children) && (
                  <ul className="absolute z-10 mt-8 hidden flex-col gap-3 rounded-b-2xl bg-white p-6 leading-8 shadow-lg group-hover:flex">
                    {item.children.map((it: IMenusPages, i: React.Key) => {
                      return (
                        <li key={i}>
                          <Link
                            href={'/' + lang + '/shop/category/' + it.pageUrl}
                            className="transition-colors duration-300 ease-in-out hover:text-red-500 focus:outline-none"
                          >
                            {it.localizeInfos.menuTitle}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <Suspense>
        <OffscreenModal menu={mainMenu} lang={lang} />
      </Suspense>
    </>
  );
};

export default NavigationMenu;
