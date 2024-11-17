import type { Dispatch, FC, SetStateAction } from 'react';
import { memo } from 'react';

interface PriceToInputProps {
  price: number;
  setPrice: Dispatch<SetStateAction<number>>;
}

/**
 * History
 * @param dict dictionary from server api
 *
 * @returns
 */
const PriceToInput: FC<PriceToInputProps> = ({ price, setPrice }) => {
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
