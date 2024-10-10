import React from 'react';

import { UsePrice } from '@/components/utils';

interface PriceDisplayProps {
  currentPrice: number;
  originalPrice: number;
  lang: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  currentPrice,
  originalPrice,
  lang,
}) => {
  if (!currentPrice && !originalPrice) {
    return;
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
          (currentPrice ? 'text-slate-300 text-sm' : 'text-orange-500 text-lg')
        }
      >
        {oldPrice}
      </div>
    </div>
  );
};

export default PriceDisplay;
