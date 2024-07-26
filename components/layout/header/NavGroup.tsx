import React from 'react';

import NavGroupItem from './NavGroupItem';

const NavGroup: React.FC = () => {
  const symbolCards = [
    {
      icon: '1',
      href: '#',
    },
    {
      icon: '2',
      href: '#',
    },
    {
      icon: '3',
      href: '#',
    }
  ];

  return (
    <div className="flex gap-5 my-auto max-md:flex-wrap max-md:max-w-full">
      {symbolCards.map((item, index) => (
        <NavGroupItem key={index} item={item} />
      ))}
    </div>
  );
};

export default NavGroup;