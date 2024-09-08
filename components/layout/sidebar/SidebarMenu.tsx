'use client';

import { usePathname } from 'next/navigation';
import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';

import { useGetMenu } from '@/app/api';
import { SidebarMenuLoader } from '@/components/shared/Loader';

import SidebarMenuItem from './SidebarMenuItem';

export const revalidate = 10;
export const dynamicParams = true;

export default function SidebarMenu() {
  const paths = usePathname();
  const pathNames = paths.split('/').filter((path: unknown) => path);
  const { menu, loading, error } = useGetMenu({
    marker: 'side_web',
  });

  if (error || !menu || loading) {
    return <SidebarMenuLoader />;
  }
  const pages = menu.pages as Array<IMenusPages & { isActive: boolean }>;

  return (
    <nav className="flex w-full">
      <ul className="flex w-full flex-row gap-2 overflow-x-auto overflow-y-hidden py-3 text-base text-neutral-600 md:max-w-[165px] md:flex-col md:gap-5 md:overflow-hidden md:py-0">
        {pages.map((item) => {
          const el = {
            ...item,
            isActive: item.pageUrl === pathNames[0],
          };
          return <SidebarMenuItem key={item.id} menuItem={el} />;
        })}
      </ul>
    </nav>
  );
}
