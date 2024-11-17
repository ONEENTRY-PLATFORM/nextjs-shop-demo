import Image from 'next/image';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import { type FC } from 'react';

import FilterModal from '@/components/layout/filter/FilterModal';

interface GridLayoutProps {
  lang: string;
  dict: IAttributeValues;
}

/**
 * ProductsNotFound
 *
 * @param lang Current language shortcode
 * @param dict dictionary from server api
 *
 * @returns ProductsNotFound
 */
const ProductsNotFound: FC<GridLayoutProps> = async ({ lang, dict }) => {
  return (
    <div className="text-center">
      <Image
        width={100}
        height={100}
        src={'/icons/cart.svg'}
        alt="..."
        className="mx-auto mb-5 size-20"
      />
      <div className="text-center text-lg">Products not found</div>
      <FilterModal prices={null} lang={lang} dict={dict} />
    </div>
  );
};

export default ProductsNotFound;
