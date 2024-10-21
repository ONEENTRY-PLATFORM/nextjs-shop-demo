import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';

import { getMenuByMarker } from '@/app/api';

import LogoutMenuItem from './components/LogoutMenuItem';
import SidebarAnimations from './components/SidebarAnimations';
import SidebarMenuItem from './components/SidebarMenuItem';
import SidebarMenuLoader from './components/SidebarMenuLoader';

const SidebarMenu = async ({ lang }: { lang: string }) => {
  const { isError, menu } = await getMenuByMarker('side_web', lang);

  if (isError || !menu) {
    return <SidebarMenuLoader />;
  }

  const pages = menu.pages as Array<IMenusPages & { isActive: boolean }>;

  return (
    <nav className="flex w-full pr-5">
      <SidebarAnimations className={''}>
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
