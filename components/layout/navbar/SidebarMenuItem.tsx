import Image from 'next/image';

interface SidebarMenuItemProps {
  icon: string;
  text: string;
  isActive?: boolean;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = (menuItem) => {
  return (
    <li
      className={`mr-auto flex justify-between gap-5 whitespace-nowrap pr-5 ${menuItem.isActive ? 'text-orange-500' : ''}`}
    >
      <Image
        width={24}
        height={24}
        loading="lazy"
        src={menuItem.icon}
        alt={menuItem.text}
        className="my-auto aspect-square w-4 shrink-0"
      />
      <div>{menuItem.text}</div>
    </li>
  );
};

export default SidebarMenuItem;
