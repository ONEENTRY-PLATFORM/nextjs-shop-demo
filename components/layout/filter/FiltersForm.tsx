/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FC } from 'react';
import { memo, useMemo } from 'react';

import { useGetPage } from '@/app/api/hooks/useGetPage';
import Loader from '@/components/shared/Loader';
import { sortObjectFieldsByPosition } from '@/components/utils';

import AvailabilityFilter from './AvailabilityFilter';
import ColorFilter from './ColorFilter';
import FilterButtons from './FilterButtons';
import PricePickerFilter from './PricePickerFilter';

const FiltersForm: FC<{ prices: any }> = ({ prices }) => {
  const { pageInfo } = useGetPage('catalog_filters');

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
    <div className="flex min-h-[600px] w-full flex-col px-10 pb-16 pt-5">
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

      <FilterButtons />
    </div>
  );
};

export default memo(FiltersForm);
