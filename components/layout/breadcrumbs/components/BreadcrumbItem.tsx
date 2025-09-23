import Link from 'next/link';
import { type FC } from 'react';

import BreadcrumbProductItem from './BreadcrumbProductItem';

interface BreadcrumbItemProps {
  link: string;
  lang: string;
  isLast: boolean;
}

/**
 * Breadcrumb item
 * @param link current link
 * @param isLast current link is last
 * @param lang Current language shortcode
 *
 * @returns JSX.Element
 */
const BreadcrumbItem: FC<BreadcrumbItemProps> = ({ link, isLast, lang }) => {
  const isProductId = Number(link) > 0 && isLast;

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
      ) : isProductId ? (
        <BreadcrumbProductItem link={link} lang={lang} />
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
