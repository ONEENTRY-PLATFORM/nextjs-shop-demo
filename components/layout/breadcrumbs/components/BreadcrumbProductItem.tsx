import type { JSX } from 'react';

import { useGetProductByIdQuery } from '@/app/api/api/RTKApi';

/**
 * Breadcrumb ProductItem component that displays product title in breadcrumbs trail
 * Fetches product data by ID and shows the product title as the current page in breadcrumbs
 * Used specifically for product detail pages in the breadcrumb navigation
 * @param   {object}      props      - BreadcrumbProductItem props
 * @param   {string}      props.link - Product ID as string to fetch product data
 * @returns {JSX.Element}            Breadcrumb item with product title or loading state
 */
const BreadcrumbProductItem = ({ link }: { link: string }): JSX.Element => {
  /** Fetch product data by ID using RTK Query hook */
  const productData = useGetProductByIdQuery({ id: Number(link) });

  return (
    /** Breadcrumb item container with separator and product title */
    <div>
      /{' '}
      <span className="text-orange-500">
        {productData.currentData?.localizeInfos.title}
      </span>
    </div>
  );
};

export default BreadcrumbProductItem;
