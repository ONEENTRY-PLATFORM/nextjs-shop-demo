import React from 'react';

import NavigationItem from './NavigationItem';

interface NavigationMenuProps {
  items: Array<{
    label: string;
    href: string;
    hasDropdown?: boolean;
    submenu?: Array<{
      label: string;
      href: string;
      hasDropdown?: boolean;
    }>;
  }>;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ items }) => {
  return (
    <nav className="flex items-center justify-center border border-solid border-neutral-100 bg-white px-5 text-lg font-bold uppercase text-neutral-600 max-md:px-5">
      <div className="flex max-w-screen-xl w-full items-center justify-center py-7 max-md:px-5">
        <ul className="flex w-full justify-between gap-5 max-md:flex-wrap">
          {items.map((item, index) => (
            <li
              key={index}
              className="group my-auto flex justify-between gap-5 whitespace-nowrap py-1"
            >
              <NavigationItem
                label={item.label}
                href={item.href}
                hasDropdown={item.hasDropdown}
              />

              {item.hasDropdown && (
                <ul className="absolute z-10 mt-6 hidden flex-col gap-4 bg-white px-6 py-8 leading-8 shadow-lg group-hover:flex">
                  {item.submenu?.map(
                    (
                      it: {
                        href: string;
                        label: string;
                      },
                      i: React.Key,
                    ) => {
                      return (
                        <li key={i}>
                          <a
                            href={it.href}
                            className="transition-colors duration-300 ease-in-out focus:outline-none"
                          >
                            {it.label}
                          </a>
                        </li>
                      );
                    },
                  )}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavigationMenu;
