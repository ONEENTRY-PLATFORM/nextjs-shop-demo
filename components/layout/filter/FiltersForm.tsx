/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import type { FC } from 'react';

import { getSingleAttributeByMarkerSet } from '@/app/api';
import { getPageByUrl } from '@/app/api/server/pages/getPageByUrl';
import Loader from '@/components/shared/Loader';
import { sortObjectFieldsByPosition } from '@/components/utils';

import AvailabilityFilter from './components/AvailabilityFilter';
import ApplyButton from './components/buttons/ApplyButton';
import ResetButton from './components/buttons/ResetButton';
import ColorFilter from './components/color/ColorFilter';
import PricePickerFilter from './components/price/PricePickerFilter';

interface FiltersFormProps {
  prices: any;
  lang: string;
  dict: any;
}

const FiltersForm: FC<FiltersFormProps> = async ({ prices, lang, dict }) => {
  const pageInfo = await getPageByUrl('catalog_filters', lang);
  const colorsData = await getSingleAttributeByMarkerSet({
    setMarker: 'product',
    attributeMarker: 'color',
    lang: lang,
  });

  const sortedAttributes: Record<any, any> = sortObjectFieldsByPosition(
    (pageInfo.page as IPagesEntity).attributeValues,
  );

  if (!sortedAttributes) {
    return <Loader />;
  }

  return (
    <div
      id="filter"
      className="flex size-full h-auto flex-col overflow-x-hidden overscroll-y-auto px-8 pb-16 pt-5 max-md:max-h-full max-md:px-6"
    >
      {Object.keys(sortedAttributes).map((attribute, index) => {
        if (attribute === 'price_filter') {
          return <PricePickerFilter key={index} prices={prices} dict={dict} />;
        }
        if (attribute === 'color_filter') {
          return (
            <ColorFilter
              key={index}
              title={sortedAttributes[attribute]?.value}
              attributes={colorsData.attribute}
            />
          );
        }
        if (attribute === 'availability_filter') {
          return (
            <AvailabilityFilter
              key={index}
              title={sortedAttributes[attribute]?.value}
            />
          );
        }
      })}
      <div className="relative mt-auto box-border flex shrink-0 flex-col gap-4">
        <ResetButton dict={dict} />
        <ApplyButton dict={dict} />
      </div>
    </div>
  );
};

export default FiltersForm;
