import type { JSX } from 'react';

import { useGetProductByIdQuery } from '@/app/api/api/RTKApi';

/**
 * Breadcrumb ProductItem.
 * @param   {object}      props      - BreadcrumbProductItem props.
 * @param   {string}      props.link - Product link.
 * @returns {JSX.Element}            JSX.Element.
 */
const BreadcrumbProductItem = ({ link }: { link: string }): JSX.Element => {
  const productData = useGetProductByIdQuery({ id: Number(link) });

  return (
    <div>
      /{' '}
      <span className="text-orange-500">
        {productData.currentData?.localizeInfos.title}
      </span>
    </div>
  );
};

export default BreadcrumbProductItem;
