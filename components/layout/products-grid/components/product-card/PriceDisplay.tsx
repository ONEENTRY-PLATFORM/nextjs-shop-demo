import type { JSX } from 'react';

import { UsePrice } from '@/components/utils/utils';

/**
 * Price display.
 * @param   {object}          props                               - Price display props.
 * @param   {object}          props.attributeValues               - Product attributes.
 * @param   {{value: number}} props.attributeValues.sale          - Sale price.
 * @param   {{value: number}} props.attributeValues.price         - Original price.
 * @param   {number}          [props.attributeValues.sale.value]  - Sale price.
 * @param   {number}          [props.attributeValues.price.value] - Original price.
 * @param   {string}          props.lang                          - Current language shortcode.
 * @returns {JSX.Element}                                         Price display with current/old prices.
 */
const PriceDisplay = ({
  attributeValues,
  lang,
}: {
  attributeValues: {
    sale?: { value: number };
    price?: { value: number };
  };
  lang: string;
}): JSX.Element => {
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
