// import type { IFilterParams } from 'oneentry/dist/products/productsInterfaces';
import React, { memo } from 'react';

const PriceFromInput: React.FC<{
  priceFrom: number;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  setPriceFrom: Function;
}> = ({ priceFrom, setPriceFrom }) => {
  const onChange = (value: number) => {
    // setPriceFrom(value);
    // if (value) {
    //   const filter: IFilterParams = {
    //     attributeMarker: 'price',
    //     conditionMarker: 'mth',
    //     conditionValue: value,
    //     pageUrl: ['shop'],
    //   };
    //   dispatch(addFilter(filter));
    // } else {
    //   const filter: IFilterParams = {
    //     attributeMarker: 'price',
    //     conditionMarker: 'mth',
    //     conditionValue: value,
    //     pageUrl: ['shop'],
    //   };
    //   dispatch(removeFilter(filter));
    // }
  };
  return (
    <input
      type="number"
      value={priceFrom}
      onChange={(e) => setPriceFrom(Number(e.target.value))}
      className="w-5/6 bg-transparent"
    />
  );
};

export default memo(PriceFromInput);
