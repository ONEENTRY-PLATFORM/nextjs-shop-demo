import type { Dispatch, JSX, SetStateAction } from 'react';
import { memo } from 'react';

/**
 * PriceToInput component that renders an input field for setting the maximum price filter.
 * This component allows users to input a numeric value for the upper price limit in filtering.
 * @param   {object}                           props          - Component properties
 * @param   {number}                           props.price    - Current price value for the input
 * @param   {Dispatch<SetStateAction<number>>} props.setPrice - State setter function to update the price value
 * @returns {JSX.Element}                                     Input field for maximum price value
 */
const PriceToInput = ({
  price,
  setPrice,
}: {
  price: number;
  setPrice: Dispatch<SetStateAction<number>>;
}): JSX.Element => {
  return (
    /* Input field for maximum price with number type */
    <input
      type="number"
      value={price}
      onChange={(e) => setPrice(Number(e.target.value))}
      className="w-5/6 bg-transparent"
    />
  );
};

export default memo(PriceToInput);
