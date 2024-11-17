import type { Dispatch, FC, SetStateAction } from 'react';
import { memo } from 'react';

interface PriceFromInputProps {
  price: number;
  setPrice: Dispatch<SetStateAction<number>>;
}

/**
 * PriceFrom Input
 * @param dict dictionary from server api
 *
 * @returns
 */
const PriceFromInput: FC<PriceFromInputProps> = ({ price, setPrice }) => {
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
