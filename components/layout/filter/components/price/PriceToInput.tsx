import type { Dispatch, FC, SetStateAction } from 'react';
import { memo } from 'react';

const PriceToInput: FC<{
  price: number;
  setPrice: Dispatch<SetStateAction<number>>;
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
