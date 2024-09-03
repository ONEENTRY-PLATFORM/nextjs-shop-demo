import Link from 'next/link';
import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';

import * as icons from '../../icons';

const SidebarMenuItem: React.FC<{ menuItem: IMenusPages & ({isActive: boolean}) }> = ({ menuItem }) => {
  
  if (!menuItem) {
    return;
  }
  const { pageUrl, localizeInfos } = menuItem;

  const Icon = icons[pageUrl];

  return (
    <li>
      <Link
        className={`mr-auto flex justify-start gap-3 whitespace-nowrap pr-5 hover:text-orange-500 ${menuItem.isActive ? 'text-orange-500' : ''} group`}
        href={'/' + pageUrl}
      >
        <div className="my-auto aspect-square size-4 shrink-0">
          <Icon />
        </div>
        <div>{localizeInfos.menuTitle}</div>
      </Link>
    </li>
  );
};

export default SidebarMenuItem;
