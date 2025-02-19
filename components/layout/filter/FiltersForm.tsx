/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IAttributesSetsEntity } from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import type { FC } from 'react';

import { getSingleAttributeByMarkerSet } from '@/app/api';
import { getPageByUrl } from '@/app/api/server/pages/getPageByUrl';
import Loader from '@/components/shared/Loader';
import { sortObjectFieldsByPosition } from '@/components/utils';

import FilterAnimations from './animations/FilterAnimations';
import AvailabilityFilter from './components/AvailabilityFilter';
import ApplyButton from './components/buttons/ApplyButton';
import ResetButton from './components/buttons/ResetButton';
import ColorFilter from './components/color/ColorFilter';
import PricePickerFilter from './components/price/PricePickerFilter';

interface FiltersFormProps {
  prices: any;
  lang: string;
  dict: IAttributeValues;
}

/**
 * Products filters form
 *
 * @param prices prices fromTo extracted from one product
 * @param lang Current language shortcode
 * @param dict dictionary from server api
 *
 * @returns Filters form
 */
const FiltersForm: FC<FiltersFormProps> = async ({ prices, lang, dict }) => {
  const pageInfo = await getPageByUrl('catalog_filters', lang);
  const data = await getSingleAttributeByMarkerSet({
    setMarker: 'product',
    attributeMarker: 'color',
    lang: lang,
  });
  const { isError, error, attribute } = data;

  const sortedAttributes: Record<any, any> = sortObjectFieldsByPosition(
    (pageInfo.page as IPagesEntity).attributeValues,
  );

  if (isError) {
    return error?.message;
  }

  if (!sortedAttributes) {
    return <Loader />;
  }

  return (
    <div
      id="filter"
      className="flex size-full h-auto flex-col overflow-x-hidden overscroll-y-auto px-8 pb-16 pt-5 max-md:max-h-full max-md:px-6"
    >
      {Object.keys(sortedAttributes).map((attr, index) => {
        if (attr === 'price_filter' && prices) {
          return (
            <FilterAnimations key={index} className="w-full" index={0}>
              <PricePickerFilter prices={prices} dict={dict} />
            </FilterAnimations>
          );
        }
        if (attr === 'color_filter') {
          return (
            <FilterAnimations key={index} className="w-full" index={1}>
              <ColorFilter
                key={index}
                title={sortedAttributes[attr]?.value}
                attributes={attribute as IAttributesSetsEntity}
              />
            </FilterAnimations>
          );
        }
        if (attr === 'availability_filter') {
          return (
            <FilterAnimations key={index} className="w-full" index={2}>
              <AvailabilityFilter
                key={index}
                title={sortedAttributes[attr]?.value}
              />
            </FilterAnimations>
          );
        }
      })}
      <div className="relative mt-auto box-border flex shrink-0 flex-col gap-4">
        <FilterAnimations className="w-full" index={3}>
          <ResetButton dict={dict} />
        </FilterAnimations>
        <FilterAnimations className="w-full" index={4}>
          <ApplyButton dict={dict} />
        </FilterAnimations>
      </div>
    </div>
  );
};

export default FiltersForm;
