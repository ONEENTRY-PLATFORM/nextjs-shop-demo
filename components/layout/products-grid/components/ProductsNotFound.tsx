import Image from 'next/image';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';

import FilterModal from '@/components/layout/filter/FilterModal';

/**
 * Grid layout props
 *
 * @property lang - Current language shortcode
 * @property dict - dictionary from server api
 */
interface GridLayoutProps {
  lang: string;
  dict: IAttributeValues;
}

/**
 * ProductsNotFound
 *
 * @param props - Grid layout props
 * @param props.lang - Current language shortcode
 * @param props.dict - dictionary from server api
 *
 * @returns ProductsNotFound component
 */
const ProductsNotFound = async ({
  lang,
  dict,
}: GridLayoutProps): Promise<JSX.Element> => {
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
