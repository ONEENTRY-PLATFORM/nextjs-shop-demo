import type { Dispatch, JSX, SetStateAction } from 'react';
import { memo } from 'react';

/**
 * PriceFromInput component that renders an input field for setting the minimum price filter.
 * This component allows users to input a numeric value for the lower price limit in filtering.
 * @param   {object}                           props          - Component properties
 * @param   {number}                           props.price    - Current price value for the input
 * @param   {Dispatch<SetStateAction<number>>} props.setPrice - State setter function to update the price value
 * @returns {JSX.Element}                                     Input field for minimum price value
 */
const PriceFromInput = ({
  price,
  setPrice,
}: {
  price: number;
  setPrice: Dispatch<SetStateAction<number>>;
}): JSX.Element => {
  return (
    /* Input field for minimum price with number type */
    <input
      type="number"
      value={price}
      onChange={(e) => setPrice(Number(e.target.value))}
      className="w-5/6 bg-transparent"
    />
  );
};

export default memo(PriceFromInput);
