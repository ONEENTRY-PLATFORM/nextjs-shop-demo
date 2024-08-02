import React from 'react';

import NavigationItem from './NavigationItem';

interface NavigationMenuProps {
  items: Array<{
    label: string;
    href: string;
    hasDropdown?: boolean;
  }>;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ items }) => {
  return (
    <nav className="flex items-center justify-center bg-white px-5 text-lg font-bold uppercase text-neutral-600 max-md:px-5">
      <div className="flex w-[1240px] max-w-full items-center justify-center py-7 max-md:px-5">
        <ul className="flex w-[1053px] max-w-full justify-between gap-5 max-md:flex-wrap">
          {items.map((item, index) => (
            <li
              key={index}
              className="my-auto flex justify-between gap-5 whitespace-nowrap py-1"
            >
              <NavigationItem
                label={item.label}
                href={item.href}
                hasDropdown={item.hasDropdown}
              />
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavigationMenu;
