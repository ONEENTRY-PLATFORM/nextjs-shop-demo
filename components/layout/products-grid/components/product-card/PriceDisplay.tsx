import type { FC } from 'react';
import React from 'react';

import { UsePrice } from '@/components/utils';

interface PriceDisplayProps {
  /** Product attributes containing price information */
  attributes: {
    /** Sale price of the product (if on sale) */
    sale?: { value: number };
    /** Regular price of the product */
    price?: { value: number };
  };
  /** Current language shortcode used for price formatting (e.g., 'en', 'fr') */
  lang: string;
}

/**
 * PriceDisplay component that shows product pricing information
 *
 * This component displays the current price of a product, handling both regular
 * and sale prices. It formats prices according to the current language and
 * provides appropriate visual styling for sale vs. regular prices.
 *
 * @param attributes - Product attributes containing price information
 * @param lang - Current language shortcode used for price formatting
 * @returns Price display with current/old prices, properly formatted
 */
const PriceDisplay: FC<PriceDisplayProps> = ({
  attributes: { sale, price },
  lang,
}) => {
  const currentPrice = sale?.value || 0;
  const originalPrice = price?.value || 0;
  if (!currentPrice && !originalPrice) {
    return null;
  }

  // Format price with Intl.NumberFormat
  const newPrice = UsePrice({ amount: currentPrice, lang });
  const oldPrice = UsePrice({
    amount: originalPrice,
    lang,
  });

  return (
    <div className="flex gap-2.5 self-center font-bold">
      {currentPrice > 0 && (
        <div
          className="text-lg leading-6 text-orange-500"
          aria-label={`New price: ${newPrice}`}
        >
          {newPrice}
        </div>
      )}
      {originalPrice > 0 && (
        <div
          className={
            'leading-6 ' +
            (currentPrice
              ? 'text-slate-300 text-sm'
              : 'text-orange-500 text-lg')
          }
          aria-label={`Original price: ${oldPrice}`}
        >
          {oldPrice}
        </div>
      )}
    </div>
  );
};

export default PriceDisplay;
