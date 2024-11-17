import type { AttributeType } from 'oneentry/dist/base/utils';
import type { FC } from 'react';
import React from 'react';

import { UsePrice } from '@/components/utils';

interface PriceDisplayProps {
  attributes: AttributeType;
  lang: string;
}

/**
 * Price display
 *
 * @param attributes
 * @param lang Current language shortcode
 *
 * @returns Price display with current/old prices
 */
const PriceDisplay: FC<PriceDisplayProps> = ({
  attributes: { sale, price },
  lang,
}) => {
  const currentPrice = sale?.value;
  const originalPrice = price?.value;
  if (!currentPrice && !originalPrice) {
    return;
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
        <div className="text-lg leading-6 text-orange-500">{newPrice}</div>
      )}
      {originalPrice > 0 && (
        <div
          className={
            'leading-6 ' +
            (currentPrice
              ? 'text-slate-300 text-sm'
              : 'text-orange-500 text-lg')
          }
        >
          {oldPrice}
        </div>
      )}
    </div>
  );
};

export default PriceDisplay;
