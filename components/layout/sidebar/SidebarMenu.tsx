import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';

import { getMenuByMarker } from '@/app/api/serverSideProps';
import { SidebarMenuLoader } from '@/components/shared/Loader';

import SidebarMenuItem from './SidebarMenuItem';

// export const revalidate = 10;
// export const dynamicParams = true;

export default async function SidebarMenu() {
  const { isError, menu } = await getMenuByMarker({
    marker: 'side_web',
    langCode: 'en_US',
  });

  if (isError || !menu) {
    return <SidebarMenuLoader />;
  }

  const pages = menu.pages as Array<IMenusPages & { isActive: boolean }>;

  return (
    <nav className="flex w-full pr-5">
      <ul className="flex w-full flex-wrap gap-2 overflow-x-auto overflow-y-hidden  py-3 text-base text-neutral-600 max-md:items-center max-md:justify-center max-md:gap-6 max-md:px-2 md:max-w-[165px] md:flex-col md:justify-start md:gap-5 md:overflow-hidden md:py-0">
        {pages.map((item) => {
          return <SidebarMenuItem key={item.id} menuItem={item} />;
        })}
        <SidebarMenuItem
          menuItem={
            {
              id: 1000,
              pageUrl: 'logout',
              localizeInfos: { menuTitle: 'Logout' },
              parentId: null,
              position: 10,
              isActive: false,
            } as IMenusPages & { isActive: boolean }
          }
        />
      </ul>
    </nav>
  );
}
