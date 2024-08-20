import Image from 'next/image';
import Link from 'next/link';

import * as icons from '../../icons';

interface SidebarMenuItemProps {
  icon: string;
  localizeInfos: {
    menuTitle: string;
  };
  isActive?: boolean;
  pageUrl: string;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = (menuItem) => {
  if (!menuItem) {
    return;
  }
  const { localizeInfos, pageUrl } = menuItem;
  const Icon = icons[pageUrl];

  return (
    <li>
      <Link
        className={`mr-auto flex justify-start gap-3 whitespace-nowrap pr-5 hover:text-orange-500 ${menuItem.isActive ? 'text-orange-500' : ''} group`}
        href={pageUrl}
      >
        <div className="my-auto aspect-square size-4 shrink-0">
          <Icon />
        </div>
        {/* <Image
          width={24}
          height={24}
          loading="lazy"
          src={pageUrl + '.svg'}
          alt={localizeInfos.menuTitle}
          className="my-auto aspect-square w-4 shrink-0"
        /> */}
        <div>{localizeInfos.menuTitle}</div>
      </Link>
    </li>
  );
};

export default SidebarMenuItem;
