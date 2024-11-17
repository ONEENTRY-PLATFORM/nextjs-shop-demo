import React from 'react';

import { UsePrice } from '@/components/utils';

interface PriceDisplayProps {
  currentPrice: number;
  originalPrice: number;
  lang: string;
}

/**
 * Description
 * @param param0 param0
 *
 * @returns
 */
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
    <div className="flex gap-2.5 font-bold">
      {currentPrice > 0 && (
        <div className="text-lg leading-8 text-orange-500">{price}</div>
      )}
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
