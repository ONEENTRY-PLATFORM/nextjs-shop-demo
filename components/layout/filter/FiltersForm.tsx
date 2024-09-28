/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FC } from 'react';
import { memo, useMemo } from 'react';

import { useGetPage } from '@/app/api/hooks/useGetPage';
import Loader from '@/components/shared/Loader';
import { sortObjectFieldsByPosition } from '@/components/utils';

import AvailabilityFilter from './components/AvailabilityFilter';
import ApplyButton from './components/buttons/ApplyButton';
import ResetButton from './components/buttons/ResetButton';
import ColorFilter from './components/color/ColorFilter';
import PricePickerFilter from './components/price/PricePickerFilter';

const FiltersForm: FC<{ prices: any }> = ({ prices }) => {
  const { pageInfo } = useGetPage('catalog_filters');
  console.log(pageInfo);

  const sortedAttributes: Record<any, any> = useMemo(() => {
    if (!pageInfo) {
      return [];
    }
    return sortObjectFieldsByPosition(pageInfo?.attributeValues);
  }, [pageInfo]);

  if (!sortedAttributes) {
    return <Loader />;
  }

  return (
    <div
      id="filter"
      className="flex size-full h-auto flex-col overflow-x-hidden overscroll-y-auto px-10 pb-16 pt-5 max-md:max-h-full"
    >
      {Object.keys(sortedAttributes).map((attribute, index) => {
        if (attribute === 'price_filter') {
          return <PricePickerFilter key={index} prices={prices} />;
        }
        if (attribute === 'color_filter') {
          return (
            <ColorFilter
              key={index}
              color_filter_title={sortedAttributes[attribute]?.value}
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
        <ResetButton />
        <ApplyButton />
      </div>
    </div>
  );
};

export default memo(FiltersForm);
