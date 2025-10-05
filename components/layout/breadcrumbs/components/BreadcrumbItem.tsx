import Link from 'next/link';
import type { JSX } from 'react';

import BreadcrumbProductItem from './BreadcrumbProductItem';

/**
 * Breadcrumb item.
 * @param props        - Breadcrumb item props.
 * @param props.link   - current link.
 * @param props.isLast - current link is last.
 * @param props.lang   - Current language shortcode.
 * @returns            JSX.Element.
 */
const BreadcrumbItem = ({
  link,
  isLast,
  lang,
}: {
  link: string;
  lang: string;
  isLast: boolean;
}): JSX.Element => {
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
            {link[0]?.toUpperCase() +
              link.slice(1, link.length).replace('_', ' ')}
          </Link>
        </>
      ) : isProductId ? (
        <BreadcrumbProductItem link={link} />
      ) : (
        <div>
          /{' '}
          <span className="text-orange-500">
            {link[0]?.toUpperCase() +
              link.slice(1, link.length).replace('_', ' ')}
          </span>
        </div>
      )}
    </>
  );
};

export default BreadcrumbItem;
