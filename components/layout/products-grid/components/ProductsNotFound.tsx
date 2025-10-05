import Image from 'next/image';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';

import FilterModal from '@/components/layout/filter/FilterModal';

/**
 * ProductsNotFound
 * @param   {object}               props      - Grid layout props
 * @param   {string}               props.lang - Current language shortcode
 * @param   {IAttributeValues}     props.dict - dictionary from server api
 * @returns {Promise<JSX.Element>}            ProductsNotFound component
 */
const ProductsNotFound = async ({
  lang,
  dict,
}: {
  lang: string;
  dict: IAttributeValues;
}): Promise<JSX.Element> => {
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
