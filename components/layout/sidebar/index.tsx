import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import type { JSX } from 'react';

import { getMenuByMarker } from '@/app/api';

import SidebarAnimations from './animations/SidebarAnimations';
import LogoutMenuItem from './components/LogoutMenuItem';
import SidebarMenuItem from './components/SidebarMenuItem';
import SidebarMenuLoader from './components/SidebarMenuLoader';

/**
 * Sidebar Menu.
 * @param   {object}               props      - Component props.
 * @param   {string}               props.lang - Current language shortcode.
 * @returns {Promise<JSX.Element>}            Sidebar menu.
 */
const SidebarMenu = async ({
  lang,
}: {
  lang: string;
}): Promise<JSX.Element> => {
  const { isError, menu } = await getMenuByMarker('side_web', lang);

  if (isError || !menu) {
    return <SidebarMenuLoader />;
  }

  const pages = menu.pages as Array<IMenusPages & { isActive: boolean }>;

  return (
    <nav className="flex w-full pr-5">
      <SidebarAnimations className={''}>
        <ul className="sidebar-menu">
          {Array.isArray(pages) ? (
            pages.map((item) => {
              return (
                <SidebarMenuItem key={item.id} menuItem={item} lang={lang} />
              );
            })
          ) : (
            <SidebarMenuLoader />
          )}
          <LogoutMenuItem />
        </ul>
      </SidebarAnimations>
    </nav>
  );
};

export default SidebarMenu;
