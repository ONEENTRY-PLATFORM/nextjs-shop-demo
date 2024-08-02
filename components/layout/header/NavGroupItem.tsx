import Image from 'next/image';
import React from 'react';

interface ItemProps {
  item: {
    icon: string;
    title: string;
    href: string;
  };
}

const NavGroupItem: React.FC<ItemProps> = ({ item }) => {
  return (
    <a
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
    </a>
  );
};

export default NavGroupItem;
