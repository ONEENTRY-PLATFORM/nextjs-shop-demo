import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import type { JSX } from 'react';

import { getMenuByMarker } from '@/app/api';

import SidebarAnimations from './animations/SidebarAnimations';
import LogoutMenuItem from './components/LogoutMenuItem';
import SidebarMenuItem from './components/SidebarMenuItem';
import SidebarMenuLoader from './components/SidebarMenuLoader';

/**
 * Sidebar menu component that displays navigation items fetched from the OneEntry CMS.
 * This component handles the fetching of menu data and renders individual menu items
 * with proper loading states and animations.
 * @param   {object}               props      - Component props.
 * @param   {string}               props.lang - Current language shortcode for fetching localized menu items.
 * @returns {Promise<JSX.Element>}            Sidebar menu with navigation items and animations.
 */
const SidebarMenu = async ({
  lang,
}: {
  lang: string;
}): Promise<JSX.Element> => {
  /** Fetch menu data by marker from the OneEntry CMS API */
  const { isError, menu } = await getMenuByMarker('side_web', lang);

  /** Show loader if there's an error or no menu data is available */
  if (isError || !menu) {
    return <SidebarMenuLoader />;
  }

  /** Cast menu pages to the expected type with isActive property */
  const pages = menu.pages as Array<IMenusPages & { isActive: boolean }>;

  return (
    <nav className="flex w-full pr-5">
      {/** Animated container for the sidebar menu */}
      <SidebarAnimations className={''}>
        <ul className="sidebar-menu">
          {Array.isArray(pages) ? (
            pages.map((item) => {
              return (
                <SidebarMenuItem key={item.id} menuItem={item} lang={lang} />
              );
            })
          ) : (
            /** Show loader if pages data is not an array */
            <SidebarMenuLoader />
          )}
          {/** Logout menu item that only appears when user is authenticated */}
          <LogoutMenuItem />
        </ul>
      </SidebarAnimations>
    </nav>
  );
};

export default SidebarMenu;
