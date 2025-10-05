import type { JSX } from 'react';

import { UsePrice } from '@/components/utils/utils';

/**
 * PriceDisplay.
 * @param   {object}      props               - Price display props.
 * @param   {number}      props.currentPrice  - Current price value.
 * @param   {number}      props.originalPrice - Original price value.
 * @param   {string}      props.lang          - Current language shortcode.
 * @returns {JSX.Element}                     Price display component.
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
  // if no price return nothing
  if (!currentPrice && !originalPrice) {
    return <></>;
  }
  const price = UsePrice({ amount: currentPrice, lang });
  const oldPrice = UsePrice({
    amount: originalPrice,
    lang,
  });

  return (
    <div className="flex gap-2.5 font-bold">
      {currentPrice > 0 && (
        <div className="text-lg leading-8 text-orange-500">{price}</div>
      )}
      <div
        className={
          'leading-8 ' +
          (currentPrice ? 'text-slate-300 text-sm' : 'text-orange-500 text-lg')
        }
      >
        {oldPrice}
      </div>
    </div>
  );
};

export default PriceDisplay;
