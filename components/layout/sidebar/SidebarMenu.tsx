import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';

import { getMenuByMarker } from '@/app/api/serverSideProps';

import SidebarMenuItem from './SidebarMenuItem';

export const revalidate = 10;
export const dynamicParams = true;

export default async function SidebarMenu() {
  // side_web
  const { menu, isError } = await getMenuByMarker({
    marker: 'side_web',
    langCode: 'en_US',
  });

  if (isError || !menu) {
    return;
  }
  const pages = menu.pages as IMenusPages[];

  return (
    <nav>
      <ul className="flex max-w-[165px] flex-col gap-5 text-base text-neutral-600">
        {pages.map((item) => (
          <SidebarMenuItem key={item.id} menuItem={item} />
        ))}
      </ul>
    </nav>
  );
}
