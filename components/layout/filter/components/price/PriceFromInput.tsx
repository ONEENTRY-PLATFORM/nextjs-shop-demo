import type { Dispatch, JSX, SetStateAction } from 'react';
import { memo } from 'react';

/**
 * PriceFrom Input.
 * @param   {object}                           props          - Input props.
 * @param   {number}                           props.price    - Price.
 * @param   {Dispatch<SetStateAction<number>>} props.setPrice - Set price.
 * @returns {JSX.Element}                                     JSX.Element
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
