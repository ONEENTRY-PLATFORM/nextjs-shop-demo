import React from 'react';

interface BreadcrumbItemProps {
  link: string;
  isLast: boolean;
}

const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({ link, isLast }) => (
  <>
    <a
      href={link}
      className="my-auto text-base leading-8 text-slate-300 hover:text-orange-500"
    >
      <p>{link}</p>
    </a>
    {!isLast && (
      <span className="my-auto text-base leading-8 text-slate-300">/</span>
    )}
  </>
);

export default BreadcrumbItem;
