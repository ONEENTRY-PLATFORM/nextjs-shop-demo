import type { Dispatch, JSX, SetStateAction } from 'react';
import { memo } from 'react';

/**
 * PriceFrom Input.
 *
 * @param props - Input props.
 * @param props.price - Price.
 * @param props.setPrice - Set price.
 *
 * @returns JSX.Element
 */
const PriceFromInput = ({
  price,
  setPrice,
}: {
  price: number;
  setPrice: Dispatch<SetStateAction<number>>;
}): JSX.Element => {
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
