import { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';

import { getMenuByMarker } from '@/app/api/serverSideProps';

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
    <div className="my-auto flex gap-5 max-md:max-w-full">
      {pages.map((element, i) => {
        return (
          <>
            {element.pageUrl === 'profile' && <NavItemProfile />}
            {element.pageUrl === 'favorites' && <NavItemFavorites />}
            {element.pageUrl === 'cart' && <NavItemCart />}
          </>
        );
      })}
    </div>
  );
}
