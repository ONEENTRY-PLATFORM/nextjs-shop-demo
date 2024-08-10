import { userMenuItems } from '@/components/data';

import SidebarMenuItem from './SidebarMenuItem';

const SidebarMenu: React.FC = () => {
  return (
    <nav>
      <ul className="flex max-w-[165px] flex-col gap-5 text-base text-neutral-600">
        {userMenuItems.map((item, index) => (
          <SidebarMenuItem key={index} {...item} />
        ))}
      </ul>
    </nav>
  );
};

export default SidebarMenu;
