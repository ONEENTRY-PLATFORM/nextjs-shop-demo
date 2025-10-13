import type { JSX } from 'react';

import { UsePrice } from '@/components/utils/utils';

/**
 * Price display component that shows current and original prices with proper formatting
 * Handles sale prices by displaying both current (discounted) and original prices
 * Applies appropriate styling based on price availability
 * @param   {object}      props               - Price display props
 * @param   {number}      props.currentPrice  - Current price value (could be sale price)
 * @param   {number}      props.originalPrice - Original price value (before discount)
 * @param   {string}      props.lang          - Current language shortcode for price formatting
 * @returns {JSX.Element}                     Price display component with formatted prices
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
  /** If neither current nor original price is available, return empty fragment */
  if (!currentPrice && !originalPrice) {
    return <></>;
  }

  /** Format current price according to the current language */
  const price = UsePrice({ amount: currentPrice, lang });

  /** Format original price according to the current language */
  const oldPrice = UsePrice({
    amount: originalPrice,
    lang,
  });

  return (
    /** Container for price display with gap between prices */
    <div className="flex gap-2.5 font-bold">
      {/** Display current price if it's greater than 0 */}
      {currentPrice > 0 && (
        <div className="text-lg leading-8 text-orange-500">{price}</div>
      )}

      {/** Display original price with conditional styling */}
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
