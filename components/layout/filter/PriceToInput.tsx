import type { IFilterParams } from 'oneentry/dist/products/productsInterfaces';
import React, { memo } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  addFilter,
  removeFilter,
  setPriceFilterActive,
} from '@/app/store/reducers/FilterSlice';

const PriceToInput: React.FC = () => {
  const dispatch = useAppDispatch();
  const { priceToSelected, maxPriceValue } = useAppSelector(
    (state) => state.filterReducer,
  );

  const onChange = (value: string) => {
    if (priceToSelected) {
      const filter: IFilterParams = {
        attributeMarker: 'price',
        conditionMarker: 'lth',
        conditionValue: priceToSelected,
        pageUrl: ['shop'],
      };
      dispatch(removeFilter(filter));
    }

    if (value) {
      const filter: IFilterParams = {
        attributeMarker: 'price',
        conditionMarker: 'lth',
        conditionValue: value,
        pageUrl: ['shop'],
      };
      dispatch(addFilter(filter));
    } else {
      const filter: IFilterParams = {
        attributeMarker: 'price',
        conditionMarker: 'lth',
        conditionValue: value,
        pageUrl: ['shop'],
      };
      dispatch(removeFilter(filter));
    }

    dispatch(setPriceFilterActive({ value, operator: 'to' }));
  };

  return (
    <input
      type="text"
      value={priceToSelected}
      placeholder={maxPriceValue?.toString()}
      onChange={(e) => onChange(e.target.value)}
      className="w-5/6 bg-transparent"
    />
  );
};

export default memo(PriceToInput);
