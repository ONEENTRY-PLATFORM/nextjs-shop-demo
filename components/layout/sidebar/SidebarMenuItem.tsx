'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';

import * as icons from '../../icons';

const SidebarMenuItem: React.FC<{
  menuItem: IMenusPages & { isActive: boolean };
}> = ({ menuItem }) => {
  const paths = usePathname();
  const pathNames = paths.split('/').filter((path: unknown) => path);

  if (!menuItem) {
    return;
  }
  const { pageUrl, localizeInfos } = menuItem;
  const Icon = icons[pageUrl as keyof typeof icons];
  const isActive = menuItem.pageUrl === pathNames[0];

  return (
    <li>
      <Link
        className={`mr-auto flex justify-start gap-3 whitespace-nowrap hover:text-orange-500 ${isActive ? 'text-orange-500' : ''} group`}
        href={'/' + pageUrl}
        aria-checked={isActive}
      >
        <div className="my-auto aspect-square size-4 shrink-0">
          <Icon active={isActive} />
        </div>
        <div>{localizeInfos.menuTitle}</div>
      </Link>
    </li>
  );
};

export default SidebarMenuItem;
