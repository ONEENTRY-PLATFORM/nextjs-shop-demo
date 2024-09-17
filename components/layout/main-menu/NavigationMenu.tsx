import Link from 'next/link';
import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import type { Key } from 'react';
import { Suspense } from 'react';

import { getMenuByMarker } from '@/app/api/serverSideProps';

import MobileMenu from './MobileMenu';
import NavigationMenuItem from './NavigationMenuItem';

function flatMenuToNested(data: [] | Array<IMenusPages>, pid: number | null) {
  return data.reduce((r: IMenusPages[], element: IMenusPages) => {
    if (pid == element.parentId) {
      const object = { ...element };
      const children = flatMenuToNested(data, element.id);

      if (children.length) {
        object.children = children;
      }

      r.push(object);
    }

    return r;
  }, []);
}

const NavigationMenu: React.FC = async () => {
  const { isError, menu } = await getMenuByMarker({
    marker: 'main_web',
    langCode: 'en_US',
  });

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
                  href={'/shop/' + item.pageUrl}
                  hasDropdown={item.children ? true : false}
                />

                {Array.isArray(item.children) && (
                  <ul className="absolute z-10 mt-8 hidden flex-col gap-3 rounded-b-2xl bg-white p-6 leading-8 shadow-lg group-hover:flex">
                    {item.children.map((it: IMenusPages, i: React.Key) => {
                      return (
                        <li key={i}>
                          <Link
                            href={'/shop/category/' + it.pageUrl}
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
        <MobileMenu menu={Array.isArray(menu.pages) ? menu.pages : []} />
      </Suspense>
    </>
  );
};

export default NavigationMenu;
