import type { FC } from 'react';
import React from 'react';

import { UsePrice } from '@/components/utils/utils';

interface PriceDisplayProps {
  attributeValues: {
    sale?: { value: number };
    price?: { value: number };
  };
  lang: string;
}

/**
 * Price display
 *
 * @param attributeValues Product attributes
 * @param lang Current language shortcode
 * @returns Price display with current/old prices
 */
const PriceDisplay: FC<PriceDisplayProps> = ({
  attributeValues: { sale, price },
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
