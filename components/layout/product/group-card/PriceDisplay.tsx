import React from 'react';

import { UsePrice } from '../../../utils';

interface PriceDisplayProps {
  currentPrice: number;
  originalPrice: number;
  currency?: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  currentPrice,
  originalPrice,
  currency,
}) => {
  if (!currentPrice && !originalPrice) {
    return;
  }
  const price = UsePrice({ amount: currentPrice, currency: currency || 'USD' });
  const oldPrice = UsePrice({ amount: originalPrice, currency: currency || 'USD' });

  return (
    <div className="mb-5 mr-auto flex gap-2 py-1">
      {currentPrice && (
        <div className="grow text-lg font-bold leading-4 text-orange-500">
          {price}
        </div>
      )}
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
