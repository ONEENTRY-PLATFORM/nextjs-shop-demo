import type { FC } from 'react';

import { useGetProductByIdQuery } from '@/app/api/api/RTKApi';

interface BreadcrumbItemProps {
  link: string;
  lang: string;
}

/**
 * Breadcrumb ProductItem
 *
 * @param link Product link
 *
 * @returns JSX.Element
 */
const BreadcrumbProductItem: FC<BreadcrumbItemProps> = ({ link }) => {
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
