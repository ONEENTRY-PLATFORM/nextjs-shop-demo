/* eslint-disable jsdoc/reject-any-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IAttributesSetsEntity } from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import type { JSX } from 'react';

import { getSingleAttributeByMarkerSet } from '@/app/api';
import { getPageByUrl } from '@/app/api/server/pages/getPageByUrl';
import Loader from '@/components/shared/Loader';
import { sortObjectFieldsByPosition } from '@/components/utils/utils';

import FilterAnimations from './animations/FilterAnimations';
import AvailabilityFilter from './components/AvailabilityFilter';
import ApplyButton from './components/buttons/ApplyButton';
import ResetButton from './components/buttons/ResetButton';
import ColorFilter from './components/color/ColorFilter';
import PricePickerFilter from './components/price/PricePickerFilter';

/**
 * Products filters form.
 * @param   {object}               props        - Props.
 * @param   {any}                  props.prices - prices fromTo extracted from one product.
 * @param   {string}               props.lang   - Current language shortcode.
 * @param   {IAttributeValues}     props.dict   - dictionary from server api.
 * @returns {Promise<JSX.Element>}              Filters form.
 */
const FiltersForm = async ({
  prices,
  lang,
  dict,
}: {
  prices: any | undefined;
  lang: string;
  dict: IAttributeValues;
}): Promise<JSX.Element> => {
  const pageInfo = await getPageByUrl('catalog_filters', lang);
  const data = await getSingleAttributeByMarkerSet({
    setMarker: 'product',
    attributeMarker: 'color',
    lang: lang,
  });
  const { isError, error, attribute } = data;

  // Fixing the type error by properly casting and checking the attributeValues structure
  const attributeValues = (pageInfo.page as IPagesEntity).attributeValues;
  const sortedAttributes: Record<string, any> = sortObjectFieldsByPosition(
    attributeValues && typeof attributeValues === 'object'
      ? (Object.fromEntries(
          Object.entries(attributeValues).filter(
            ([, value]) =>
              value && typeof value === 'object' && 'position' in value,
          ),
        ) as Record<string, { position: number }>)
      : {},
  );

  if (isError) {
    return <>{error?.message}</>;
  }

  if (!sortedAttributes) {
    return <Loader />;
  }

  const attributeKeys = Object.keys(sortedAttributes);

  return (
    <div
      id="filter"
      className="flex size-full h-auto flex-col overflow-x-hidden overscroll-y-auto px-8 pb-16 pt-5 max-md:max-h-full max-md:px-6"
    >
      {Array.isArray(attributeKeys) ? (
        attributeKeys.map((attr, index) => {
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
          return null;
        })
      ) : (
        <Loader />
      )}
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
