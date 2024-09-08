import { type Key } from 'react';

import { getMenuByMarker } from '@/app/api/serverSideProps';

import MenuButton from './MenuButton';
import NavItemCart from './NavItemCart';
import NavItemFavorites from './NavItemFavorites';
import NavItemProfile from './NavItemProfile';

export default async function NavGroup() {
  const { menu, isError } = await getMenuByMarker({
    marker: 'user_web',
    langCode: 'en_US',
  });

  if (isError || !menu) {
    return;
  }
  const { pages } = menu;

  return (
    <div className="my-auto flex items-center gap-10 max-md:max-w-full">
      {Array.isArray(pages) &&
        pages.map((element: { pageUrl: string }, i: Key) => {
          return (
            <div className="flex size-6" key={i}>
              {element.pageUrl === 'profile' && <NavItemProfile key={i} />}
              {element.pageUrl === 'favorites' && <NavItemFavorites />}
              {element.pageUrl === 'cart' && <NavItemCart key={i} />}
            </div>
          );
        })}
      <MenuButton />
    </div>
  );
}
