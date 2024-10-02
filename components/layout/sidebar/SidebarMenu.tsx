import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';

import { getMenuByMarker } from '@/app/api';
import { SidebarMenuLoader } from '@/components/shared/Loader';

import LogoutMenuItem from './LogoutMenuItem';
import SidebarMenuItem from './SidebarMenuItem';

export default async function SidebarMenu({ lang }: { lang: string }) {
  const { isError, menu } = await getMenuByMarker('side_web', lang);

  if (isError || !menu) {
    return <SidebarMenuLoader />;
  }

  const pages = menu.pages as Array<IMenusPages & { isActive: boolean }>;

  return (
    <nav className="flex w-full pr-5">
      <ul className="flex w-full flex-wrap justify-between gap-2 overflow-x-auto overflow-y-hidden py-3 text-base text-neutral-600 max-md:items-center max-md:justify-center max-md:gap-6 max-md:px-2 max-sm:gap-3 md:max-w-[165px] md:flex-col md:justify-start md:gap-5 md:overflow-hidden md:py-0">
        {pages.map((item) => {
          return <SidebarMenuItem key={item.id} menuItem={item} lang={lang} />;
        })}
        <LogoutMenuItem />
      </ul>
    </nav>
  );
}
