import React from 'react';

import NavGroupItem from './NavGroupItem';

const items = [
  {
    icon: '/icons/user.svg',
    href: '/profile',
    title: 'user',
  },
  {
    icon: '/icons/heart.svg',
    href: '/favorites',
    title: 'heart',
  },
  {
    icon: '/icons/cart.svg',
    href: '/cart',
    title: 'cart',
  },
];

const NavGroup: React.FC = () => {
  return (
    <div className="my-auto flex gap-5 max-md:max-w-full">
      {items.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <NavGroupItem key={index} item={item} />
      ))}
    </div>
  );
};

export default NavGroup;
