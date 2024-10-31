import Link from 'next/link';
import type { FC } from 'react';

interface BreadcrumbItemProps {
  link: string;
  lang: string;
  isLast: boolean;
}

const BreadcrumbItem: FC<BreadcrumbItemProps> = ({ link, isLast, lang }) => {
  return (
    <>
      {!isLast ? (
        <>
          /{' '}
          <Link
            href={'/' + lang + '/' + link}
            className="my-auto text-base hover:text-orange-500"
          >
            {link[0].toUpperCase() +
              link.slice(1, link.length).replace('_', ' ')}
          </Link>
        </>
      ) : (
        <div>
          /{' '}
          <span className="text-orange-500">
            {link[0].toUpperCase() +
              link.slice(1, link.length).replace('_', ' ')}
          </span>
        </div>
      )}
    </>
  );
};

export default BreadcrumbItem;
