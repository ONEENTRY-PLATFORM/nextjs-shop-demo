import React from "react";
import Image from "next/image";

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
      className="box-border flex relative flex-col shrink-0 w-6 h-6"
    >
      <Image
        className="object-contain"
        fill
        alt={item.title}
        src={item.icon}
        priority={true}
      />
    </a>
  );
};

export default NavGroupItem;
