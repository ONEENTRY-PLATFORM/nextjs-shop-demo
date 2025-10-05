import type { Dispatch, JSX, SetStateAction } from 'react';
import { memo } from 'react';

/**
 * PriceToInput.
 * @param   {object}                           props          - props.
 * @param   {number}                           props.price    - price value.
 * @param   {Dispatch<SetStateAction<number>>} props.setPrice - set price.
 * @returns {JSX.Element}                                     PriceToInput component.
 */
const PriceToInput = ({
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

export default memo(PriceToInput);
