import React from 'react';
import BreadcrumbItem from './BreadcrumbItem';

interface BreadcrumbsTrailProps {
  items: Array<{ 
    href: string; 
    text: string 
  }>;
}

const BreadcrumbsTrail: React.FC<BreadcrumbsTrailProps> = ({ items }) => (
  <nav className="box-border flex relative flex-row shrink-0 gap-1.5">
    {items.map((item, index) => (
      <BreadcrumbItem
        key={index}
        href={item.href}
        text={item.text}
        isLast={index === items.length - 1}
      />
    ))}
  </nav>
);

export default BreadcrumbsTrail;