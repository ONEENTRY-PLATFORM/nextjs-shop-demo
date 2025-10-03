import React from 'react';

import { UsePrice } from '@/components/utils/utils';

/**
 * Price display props
 *
 * @property currentPrice - Current price value
 * @property originalPrice - Original price value
 * @property lang - Current language shortcode
 */
interface PriceDisplayProps {
  currentPrice: number;
  originalPrice: number;
  lang: string;
}

/**
 * PriceDisplay
 *
 * @param props - Price display props
 * @param props.currentPrice - Current price value
 * @param props.originalPrice - Original price value
 * @param props.lang - Current language shortcode
 *
 * @returns Price display component
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
