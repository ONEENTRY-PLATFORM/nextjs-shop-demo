import Image from 'next/image';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';

import FilterModal from '@/components/layout/filter/FilterModal';

/**
 * ProductsNotFound component displays a message when no products are found for the current search or filter criteria.
 * It shows a cart icon, a "Products not found" message, and a filter modal to help users adjust their search.
 * This component is typically displayed when a search returns no results or when all products are filtered out.
 * @param   {object}               props      - Component properties
 * @param   {string}               props.lang - Current language shortcode for localization
 * @param   {IAttributeValues}     props.dict - Dictionary of attribute values from server API for labels and messages
 * @returns {Promise<JSX.Element>}            A div element containing a message and filter options when no products are found
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
      <FilterModal prices={{ min: 0, max: 1 }} lang={lang} dict={dict} />
    </div>
  );
};

export default ProductsNotFound;
