import type { IFilterParams } from 'oneentry/dist/products/productsInterfaces';
import React, { memo } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  addFilter,
  removeFilter,
  setPriceFilterActive,
} from '@/app/store/reducers/FilterSlice';

const PriceFromInput: React.FC = () => {
  const dispatch = useAppDispatch();
  const { priceFromSelected, minPriceValue } = useAppSelector(
    (state) => state.filterReducer,
  );

  const onChange = (value: string) => {
    if (priceFromSelected) {
      const filter: IFilterParams = {
        attributeMarker: 'price',
        conditionMarker: 'mth',
        conditionValue: priceFromSelected,
        pageUrl: ['shop'],
      };
      dispatch(removeFilter(filter));
    }
    if (value) {
      const filter: IFilterParams = {
        attributeMarker: 'price',
        conditionMarker: 'mth',
        conditionValue: value,
        pageUrl: ['shop'],
      };
      dispatch(addFilter(filter));
    } else {
      const filter: IFilterParams = {
        attributeMarker: 'price',
        conditionMarker: 'mth',
        conditionValue: value,
        pageUrl: ['shop'],
      };
      dispatch(removeFilter(filter));
    }

    dispatch(setPriceFilterActive({ value, operator: 'from' }));
  };

  return (
    <input
      type="text"
      value={priceFromSelected}
      placeholder={minPriceValue?.toString()}
      onChange={(e) => onChange(e.target.value)}
      className="w-5/6 bg-transparent"
    />
  );
};

export default memo(PriceFromInput);
