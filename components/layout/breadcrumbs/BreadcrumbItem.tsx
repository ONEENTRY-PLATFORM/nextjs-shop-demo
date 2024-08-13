import React from 'react';

interface BreadcrumbItemProps {
  link: string;
  isLast: boolean;
}

const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({ link, isLast }) => (
  <>
    {!isLast ? (
      <>
        /{' '}
        <a
          href={'/' + link}
          className="my-auto text-base hover:text-orange-500"
        >
          {link}
        </a>
      </>
    ) : (
      <p className="text-slate-700">{link}</p>
    )}
  </>
);

export default BreadcrumbItem;
