'use client';

import { usePathname } from 'next/navigation';
import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import { Suspense } from 'react';

import { useGetMenu } from '@/app/api';
import { getMenuByMarker } from '@/app/api/serverSideProps';

import SidebarMenuItem from './SidebarMenuItem';

export const revalidate = 10;
export const dynamicParams = true;

export default function SidebarMenu() {
  const paths = usePathname();
  const pathNames = paths.split('/').filter((path: unknown) => path);
  // side_web
  const { menu, loading, error } = useGetMenu({
    marker: 'side_web',
  });

  console.log(pathNames);
  if (error || !menu) {
    return;
  }
  const pages = menu.pages as Array<IMenusPages & { isActive: boolean }>;

  return (
    <nav>
      <ul className="flex max-w-[165px] flex-col gap-5 text-base text-neutral-600">
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
