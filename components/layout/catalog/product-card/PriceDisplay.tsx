import type { FC } from 'react';
import React from 'react';

import { UsePrice } from '@/components/utils';

interface PriceDisplayProps {
  currentPrice: number;
  originalPrice: number;
  currency?: string;
}

const PriceDisplay: FC<PriceDisplayProps> = ({
  currentPrice,
  originalPrice,
  currency,
}) => {
  if (!currentPrice && !originalPrice) {
    return;
  }
  const price = UsePrice({ amount: currentPrice, currency: currency || 'USD' });
  const oldPrice = UsePrice({
    amount: originalPrice,
    currency: currency || 'USD',
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
