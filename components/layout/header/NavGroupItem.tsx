import React from 'react';

interface ItemProps {
  item: {
    icon: string;
    href: string;
  };
}

const NavGroupItem: React.FC<ItemProps> = ({ item }) => {
  return (
    <a href={item.href} className="box-border flex relative flex-col shrink-0">
      {item.icon}
    </a>
  );
};

export default NavGroupItem;
