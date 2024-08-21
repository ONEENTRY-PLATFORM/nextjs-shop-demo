import type { Key } from 'react';

import { getMenuByMarker } from '@/app/api/serverSideProps';

// import { userMenuItems } from '@/components/data';
import SidebarMenuItem from './SidebarMenuItem';

export default async function SidebarMenu() {
  // side_web
  const { menu, isError } = await getMenuByMarker({
    marker: 'side_web',
    langCode: 'en_US',
  });

  if (isError || !menu) {
    return;
  }

  return (
    <nav>
      <ul className="flex max-w-[165px] flex-col gap-5 text-base text-neutral-600">
        {menu.pages.map((item, index: Key) => (
          <SidebarMenuItem key={index} {...item} />
        ))}
      </ul>
    </nav>
  );
}
