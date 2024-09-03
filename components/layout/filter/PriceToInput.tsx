import React, { memo } from 'react';

const PriceToInput: React.FC<{
  price: number;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  setPrice: Function;
}> = ({ price, setPrice }) => {
  return (
    <input
      type="number"
      value={price}
      onChange={(e) => setPrice(Number(e.target.value))}
      className="w-5/6 bg-transparent"
    />
  );
};

export default memo(PriceToInput);
