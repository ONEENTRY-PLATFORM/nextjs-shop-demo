import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';

import { getMenuByMarker } from '@/app/api';
import SidebarAnimations from '@/components/layout/sidebar/SidebarAnimations';

import LogoutMenuItem from './LogoutMenuItem';
import SidebarMenuItem from './SidebarMenuItem';
import SidebarMenuLoader from './SidebarMenuLoader';

const SidebarMenu = async ({ lang }: { lang: string }) => {
  const { isError, menu } = await getMenuByMarker('side_web', lang);

  if (isError || !menu) {
    return <SidebarMenuLoader />;
  }

  const pages = menu.pages as Array<IMenusPages & { isActive: boolean }>;

  return (
    <nav className="flex w-full pr-5">
      <SidebarAnimations>
        <ul className="sidebar-menu">
          {pages.map((item) => {
            return (
              <SidebarMenuItem key={item.id} menuItem={item} lang={lang} />
            );
          })}
          <LogoutMenuItem />
        </ul>
      </SidebarAnimations>
    </nav>
  );
};

export default SidebarMenu;
