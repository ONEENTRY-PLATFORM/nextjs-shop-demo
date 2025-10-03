import type { JSX } from 'react';

import { UsePrice } from '@/components/utils/utils';

/**
 * Price display props
 *
 * @property attributeValues - Product attributes
 * @property lang - Current language shortcode
 */
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
 * @param props - Price display props
 * @param props.attributeValues - Product attributes
 * @param props.lang - Current language shortcode
 *
 * @returns Price display with current/old prices
 */
const PriceDisplay = ({
  attributeValues,
  lang,
}: PriceDisplayProps): JSX.Element => {
  const currentPrice = attributeValues?.sale?.value || 0;
  const originalPrice = attributeValues?.price?.value || 0;
  if (!currentPrice && !originalPrice) {
    return <></>;
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
