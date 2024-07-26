import React from 'react';

interface NavigationItemProps {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ label, href, hasDropdown }) => {
  return (
    <a href={href} className="box-border flex relative flex-row shrink-0 gap-2.5">
      <div>{label}</div>
      {hasDropdown && (
        <img 
          loading="lazy" 
          src="" 
          className="shrink-0 aspect-[1.67] h-[18px] stroke-[3px] stroke-neutral-600 w-[25px]" 
          alt=""
        />
      )}
    </a>
  );
};

export default NavigationItem;