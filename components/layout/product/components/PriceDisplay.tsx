import type { JSX } from 'react';

import { UsePrice } from '@/components/utils/utils';

/**
 * Price display component.
 * @param   {object}      props               - Component properties
 * @param   {number}      props.currentPrice  - Current price value to display (can be discounted price)
 * @param   {number}      props.originalPrice - Original price value before discount (for strikethrough pricing)
 * @param   {string}      props.lang          - Current language shortcode for locale-specific price formatting
 * @returns {JSX.Element}                     - Formatted price display showing current and/or original prices
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
          (currentPrice ? 'text-sm text-slate-300' : 'text-lg text-orange-500')
        }
      >
        {oldPrice}
      </div>
    </div>
  );
};

export default PriceDisplay;
