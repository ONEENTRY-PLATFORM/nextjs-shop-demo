import type { JSX } from 'react';

import { UsePrice } from '@/components/utils/utils';

/**
 * Price display component.
 * Displays product prices with proper formatting based on the current language.
 * Shows both current and original prices when available, with appropriate styling.
 * Handles cases where prices may be missing or zero.
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
  /**
   * Return empty fragment if both prices are not provided or are zero
   * This prevents rendering price information when no valid price data is available
   */
  if (!currentPrice && !originalPrice) {
    return <></>;
  }

  /**
   * Format the current price using the utility hook with the specified language
   * This ensures the price is displayed with correct currency symbol and decimal formatting
   */
  const price = UsePrice({ amount: currentPrice, lang });

  /**
   * Format the original price using the utility hook with the specified language
   * This maintains consistent formatting between current and original prices
   */
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
