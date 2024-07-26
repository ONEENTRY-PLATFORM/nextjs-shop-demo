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
    <nav className="flex justify-center items-center px-5 text-lg font-bold uppercase bg-white border border-solid border-[black] text-neutral-600 max-md:px-5">
      <div className="flex justify-center items-center py-7 max-w-full w-[1235px] max-md:px-5">
        <ul className="flex gap-5 justify-between max-w-full w-[1053px] max-md:flex-wrap">
          {items.map((item, index) => (
            <li key={index} className="flex gap-5 justify-between py-1 my-auto whitespace-nowrap">
              <NavigationItem label={item.label} href={item.href} hasDropdown={item.hasDropdown} />
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavigationMenu;