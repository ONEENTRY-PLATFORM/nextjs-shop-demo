import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface NavItemProps {
  item: {
    icon: string;
    title: string;
    href: string;
  };
}

const NavGroupItem: React.FC<NavItemProps> = ({ item }) => {
  return (
    <Link
      href={item.href}
      title={item.title}
      className="relative box-border flex size-6 shrink-0 flex-col"
    >
      <Image
        className="object-contain"
        fill
        alt={item.title}
        src={item.icon}
        priority
      />
    </Link>
  );
};

export default NavGroupItem;
