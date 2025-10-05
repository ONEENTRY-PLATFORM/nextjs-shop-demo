import type { JSX } from 'react';

import { UsePrice } from '../../../utils/utils';

/**
 * Price display component.
 * @param   {object}      props               - component props.
 * @param   {number}      props.currentPrice  - current price.
 * @param   {number}      props.originalPrice - original price.
 * @param   {string}      props.lang          - current language shortcode.
 * @returns {JSX.Element}                     Price display with current/old prices.
 */
const PriceDisplay = ({
  currentPrice,
  originalPrice,
  lang,
}: {
  currentPrice: number;
  originalPrice: number;
  lang: string;
}): JSX.Element => {
  if (!currentPrice && !originalPrice) {
    return <></>;
  }
  const price = UsePrice({ amount: currentPrice, lang });
  const oldPrice = UsePrice({
    amount: originalPrice,
    lang,
  });

  return (
    <div className="mb-5 mr-auto flex gap-2 py-1">
      {currentPrice && (
        <div className="grow text-lg font-bold leading-4 text-orange-500">
          {price}
        </div>
      )}
      <div
        className={
          'leading-4 ' +
          (currentPrice ? 'text-gray-400 text-sm' : 'text-orange-500 text-lg')
        }
      >
        {oldPrice}
      </div>
    </div>
  );
};

export default PriceDisplay;
