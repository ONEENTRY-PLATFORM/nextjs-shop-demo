import Image from 'next/image';
import Link from 'next/link';

interface SidebarMenuItemProps {
  icon: string;
  text: string;
  isActive?: boolean;
  href: string;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = (menuItem) => {
  return (
    <li>
      <Link
        className={`mr-auto flex justify-start gap-3 whitespace-nowrap pr-5 ${menuItem.isActive ? 'text-orange-500' : ''}`}
        href={menuItem.href}
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
      </Link>
    </li>
  );
};

export default SidebarMenuItem;
