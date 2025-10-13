import Link from 'next/link';
import type { JSX } from 'react';

import BreadcrumbProductItem from './BreadcrumbProductItem';

/**
 * Breadcrumb item component that renders individual breadcrumb elements
 * Handles different types of breadcrumb items: navigable links, product items, and current page indicators
 * Conditionally renders as a link, product component, or static text based on position and content
 * @param   {object}      props        - Breadcrumb item props
 * @param   {string}      props.link   - Current link segment for the breadcrumb
 * @param   {boolean}     props.isLast - Indicates if this is the last item in the breadcrumb trail
 * @param   {string}      props.lang   - Current language shortcode for URL localization
 * @returns {JSX.Element}              Breadcrumb item as link, product component, or static text
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
  /** Check if the link is a product ID (numeric) and is the last item in the trail */
  const isProductId = Number(link) > 0 && isLast;

  return (
    <>
      {/** Render breadcrumb item based on its position and type */}
      {!isLast ? (
        /** For non-last items, render as navigable link */
        <>
          /{' '}
          <Link
            href={'/' + lang + '/' + link}
            className="my-auto text-base hover:text-orange-500"
          >
            {/** Format link text: capitalize first letter and replace underscores with spaces */}
            {link[0]?.toUpperCase() +
              link.slice(1, link.length).replace('_', ' ')}
          </Link>
        </>
      ) : isProductId ? (
        /** For last item that is a product ID, render product-specific breadcrumb component */
        <BreadcrumbProductItem link={link} />
      ) : (
        /** For last item that is not a product ID, render as static text indicating current page */
        <div>
          /{' '}
          <span className="text-orange-500">
            {/** Format current page text: capitalize first letter and replace underscores with spaces */}
            {link[0]?.toUpperCase() +
              link.slice(1, link.length).replace('_', ' ')}
          </span>
        </div>
      )}
    </>
  );
};

export default BreadcrumbItem;
