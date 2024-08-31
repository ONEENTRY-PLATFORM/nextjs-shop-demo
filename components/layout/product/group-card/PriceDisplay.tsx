import React from 'react';

import { UsePrice } from '../../../utils';

interface PriceDisplayProps {
  currentPrice: number;
  originalPrice: number;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  currentPrice,
  originalPrice,
}) => {
  const price = UsePrice({ amount: currentPrice, currency: 'USD' });
  const oldPrice = UsePrice({ amount: originalPrice, currency: 'USD' });

  return (
    <div className="mb-5 mr-auto flex gap-2 py-1">
      <div className="grow text-lg font-bold leading-4 text-orange-500">
        {price}
      </div>
      <div className="text-sm leading-4 text-gray-400">{oldPrice}</div>
    </div>
  );
};

export default PriceDisplay;
