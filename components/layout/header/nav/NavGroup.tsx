import type { FC } from 'react';
import { type Key } from 'react';

import { getMenuByMarker } from '@/app/api';

import MenuButton from './MenuButton';
import NavItemCart from './NavItemCart';
import NavItemFavorites from './NavItemFavorites';
import NavItemProfile from './NavItemProfile';

const NavGroup: FC<{ lang: string }> = async ({ lang }) => {
  const langCode = 'en_US';
  const { menu, isError } = await getMenuByMarker('user_web', langCode);

  if (isError || !menu) {
    return;
  }
  const { pages } = menu;

  return (
    <div className="my-auto flex items-center gap-10 max-md:max-w-full max-md:gap-4">
      {Array.isArray(pages) &&
        pages.map((item: { pageUrl: string }, i: Key) => {
          return (
            <div className="flex size-6" key={i}>
              {item.pageUrl === 'profile' && <NavItemProfile item={item} />}
              {item.pageUrl === 'favorites' && <NavItemFavorites item={item} />}
              {item.pageUrl === 'cart' && <NavItemCart item={item} />}
            </div>
          );
        })}
      <MenuButton />
    </div>
  );
};

export default NavGroup;
