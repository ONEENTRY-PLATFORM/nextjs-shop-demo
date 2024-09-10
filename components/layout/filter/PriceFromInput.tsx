import type { Dispatch } from 'react';
import React, { memo } from 'react';

const PriceFromInput: React.FC<{
  price: number;
  setPrice: Dispatch<React.SetStateAction<number>>;
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

export default memo(PriceFromInput);
