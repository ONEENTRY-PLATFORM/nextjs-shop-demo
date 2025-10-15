import type { JSX } from 'react';

import { UsePrice } from '../../../utils/utils';

/**
 * Price display component.
 * Displays product prices with proper formatting based on the current language.
 * Shows both current and original prices when available, with appropriate styling.
 * Handles cases where prices may be missing or zero.
 * @param   {object}      props               - Component properties
 * @param   {number}      props.currentPrice  - Current price value to display
 * @param   {number}      props.originalPrice - Original price value (for strikethrough pricing)
 * @param   {string}      props.lang          - Current language shortcode for price formatting (e.g., "en", "zh")
 * @returns {JSX.Element}                     Rendered price display with current and/or old prices
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
   * Return empty fragment if both prices are missing or zero
   * This prevents displaying unnecessary price elements when no pricing information is available
   */
  if (!currentPrice && !originalPrice) {
    return <></>;
  }

  /**
   * Format the current price using the utility function with language-specific formatting
   * The UsePrice hook handles currency formatting based on the provided language code
   */
  const price = UsePrice({ amount: currentPrice, lang });

  /**
   * Format the original price using the same utility function
   * This ensures consistent formatting between current and original prices
   */
  const oldPrice = UsePrice({
    amount: originalPrice,
    lang,
  });

  return (
    <div className="mb-5 mr-auto flex gap-2 py-1">
      {/** Display current price if it exists */}
      {currentPrice && (
        <div className="grow text-lg font-bold leading-4 text-orange-500">
          {price}
        </div>
      )}
      {/** Display original price with conditional styling */}
      {/** If current price exists, show original price as smaller gray text (strikethrough pricing) */}
      {/** If no current price, show original price as main price in orange */}
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
