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
 * Products filters form component that renders various filter options for products.
 * This component fetches filter attributes and displays them in a sorted order
 * based on their position settings from the CMS.
 * @param   {object}               props            - Component properties
 * @param   {object}               props.prices     - Price range object containing min and max values
 * @param   {number}               props.prices.min - Minimum price extracted from products
 * @param   {number}               props.prices.max - Maximum price extracted from products
 * @param   {string}               props.lang       - Current language shortcode (e.g., 'en', 'ru')
 * @param   {IAttributeValues}     props.dict       - Dictionary of attribute values from server API
 * @returns {Promise<JSX.Element>}                  Filter form with price, color, and availability filters
 */
const FiltersForm = async ({
  lang,
  dict,
  prices,
}: {
  lang: string;
  dict: IAttributeValues;
  prices: {
    min: number;
    max: number;
  };
}): Promise<JSX.Element> => {
  /** Fetch page information for catalog filters and color attribute data */
  const pageInfo = await getPageByUrl('catalog_filters', lang);
  const data = await getSingleAttributeByMarkerSet({
    setMarker: 'product',
    attributeMarker: 'color',
    lang: lang,
  });
  const { isError, error, attribute } = data;

  /** Extract and sort attribute values by position */
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

  /** Handle error state */
  if (isError) {
    return <>{error?.message}</>;
  }

  /** Show loader if no attributes found */
  if (!sortedAttributes) {
    return <Loader />;
  }

  /** Get attribute keys for mapping filter components */
  const attributeKeys = Object.keys(sortedAttributes);

  return (
    <div
      id="filter"
      className="flex size-full h-auto flex-col overflow-x-hidden overscroll-y-auto px-8 pb-16 pt-5 max-md:max-h-full max-md:px-6"
    >
      {Array.isArray(attributeKeys) ? (
        attributeKeys.map((attr) => {
          /** Render price filter component */
          if (attr === 'price_filter' && prices) {
            return (
              <FilterAnimations key={attr} className="w-full" index={0}>
                <PricePickerFilter prices={prices} dict={dict} />
              </FilterAnimations>
            );
          }
          /** Render color filter component */
          if (attr === 'color_filter') {
            return (
              <FilterAnimations key={attr} className="w-full" index={1}>
                <ColorFilter
                  title={sortedAttributes[attr]?.value}
                  attributes={attribute as IAttributesSetsEntity}
                />
              </FilterAnimations>
            );
          }
          /** Render availability filter component */
          if (attr === 'availability_filter') {
            return (
              <FilterAnimations key={attr} className="w-full" index={2}>
                <AvailabilityFilter title={sortedAttributes[attr]?.value} />
              </FilterAnimations>
            );
          }
          return null;
        })
      ) : (
        <Loader />
      )}
      <div className="relative mt-auto box-border flex shrink-0 flex-col gap-4">
        {/** Render reset button */}
        <FilterAnimations className="w-full" index={3}>
          <ResetButton dict={dict} />
        </FilterAnimations>
        {/** Render apply button */}
        <FilterAnimations className="w-full" index={4}>
          <ApplyButton dict={dict} />
        </FilterAnimations>
      </div>
    </div>
  );
};

export default FiltersForm;
