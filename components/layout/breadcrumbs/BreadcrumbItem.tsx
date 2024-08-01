import React from 'react';

interface BreadcrumbItemProps {
  href: string;
  text: string;
  isLast: boolean;
}

const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({
  href,
  text,
  isLast,
}) => (
  <>
    <a
      href={href}
      className="my-auto text-base leading-8 text-slate-300 hover:text-orange-500"
    >
      <p>{text}</p>
    </a>
    {!isLast && (
      <span className="my-auto text-base leading-8 text-slate-300">
        <p>/</p>
      </span>
    )}
  </>
);

export default BreadcrumbItem;
