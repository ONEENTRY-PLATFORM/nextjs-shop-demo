import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';

import SidebarAnimations from '@/app/animations/SidebarAnimations';
import { getMenuByMarker } from '@/app/api';
import { SidebarMenuLoader } from '@/components/shared/Loader';

import LogoutMenuItem from './LogoutMenuItem';
import SidebarMenuItem from './SidebarMenuItem';

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
