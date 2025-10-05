import type { JSX } from 'react';
import React from 'react';

import { UsePrice } from '@/components/utils/utils';

/**
 * Price display
 * @param   {object}      props               - Price display props
 * @param   {number}      props.currentPrice  - current price value
 * @param   {number}      props.originalPrice - original price value
 * @param   {string}      props.lang          - current language shortcode
 * @returns {JSX.Element}                     Price display with current/old prices
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
    <div className="flex gap-2.5 self-center font-bold">
      {currentPrice > 0 && (
        <div className="text-lg leading-6 text-orange-500">{price}</div>
      )}
      <div
        className={
          'leading-6 ' +
          (currentPrice ? 'text-slate-300 text-sm' : 'text-orange-500 text-lg')
        }
      >
        {oldPrice}
      </div>
    </div>
  );
};

export default PriceDisplay;
