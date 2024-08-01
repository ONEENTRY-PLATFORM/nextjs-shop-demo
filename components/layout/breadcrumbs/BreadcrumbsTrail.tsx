import React from 'react';

import BreadcrumbItem from './BreadcrumbItem';

interface BreadcrumbsTrailProps {
  items: Array<{
    href: string;
    text: string;
  }>;
}

const BreadcrumbsTrail: React.FC<BreadcrumbsTrailProps> = ({ items }) => (
  <nav className="relative box-border flex shrink-0 flex-row gap-1.5">
    {items.map((item, index) => (
      <BreadcrumbItem
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        href={item.href}
        text={item.text}
        isLast={index === items.length - 1}
      />
    ))}
  </nav>
);

export default BreadcrumbsTrail;
