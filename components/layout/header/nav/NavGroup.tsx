import type { Key } from 'react';

import { getMenuByMarker } from '@/app/api/serverSideProps';

import NavItemFavorites from '../NavItemFavorites';
import NavItemCart from './NavItemCart';
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
    <div className="my-auto flex gap-5 max-md:max-w-full">
      {Array.isArray(pages) &&
        pages.map((element: { pageUrl: string }, i: Key) => {
          return (
            <span key={i}>
              {element.pageUrl === 'profile' && <NavItemProfile key={i} />}
              {element.pageUrl === 'favorites' && <NavItemFavorites />}
              {element.pageUrl === 'cart' && <NavItemCart key={i} />}
            </span>
          );
        })}
    </div>
  );
}
