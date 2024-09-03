import React, { memo } from 'react';

const PriceToInput: React.FC<{
  priceTo: number;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  setPriceTo: Function;
}> = ({ priceTo, setPriceTo }) => {
  const onChange = (value: number) => {
    // setPriceTo(value);
    // if (value) {
    //   const filter: IFilterParams = {
    //     attributeMarker: 'price',
    //     conditionMarker: 'lth',
    //     conditionValue: value,
    //     pageUrl: ['shop'],
    //   };
    //   dispatch(addFilter(filter));
    // } else {
    //   const filter: IFilterParams = {
    //     attributeMarker: 'price',
    //     conditionMarker: 'lth',
    //     conditionValue: value,
    //     pageUrl: ['shop'],
    //   };
    //   dispatch(removeFilter(filter));
    // }
  };

  return (
    <input
      type="number"
      value={priceTo}
      onChange={(e) => setPriceTo(Number(e.target.value))}
      className="w-5/6 bg-transparent"
    />
  );
};

export default memo(PriceToInput);
