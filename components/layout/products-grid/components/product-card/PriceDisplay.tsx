import type { JSX } from 'react';

import { UsePrice } from '@/components/utils/utils';

/**
 * PriceDisplay component renders product pricing information with proper formatting.
 * It displays both sale price and original price when available, with appropriate styling
 * to distinguish between the two. The component uses internationalization for proper
 * price formatting based on the current language.
 * @param   {object}      props                               - Component properties
 * @param   {object}      props.attributeValues               - Product attributes containing price information
 * @param   {object}      [props.attributeValues.sale]        - Sale price object
 * @param   {number}      [props.attributeValues.sale.value]  - Sale price value
 * @param   {object}      [props.attributeValues.price]       - Original price object
 * @param   {number}      [props.attributeValues.price.value] - Original price value
 * @param   {string}      props.lang                          - Current language shortcode for price formatting
 * @returns {JSX.Element}                                     A div element containing formatted price information, or empty fragment if no prices available
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
  /** Extract current (sale) price and original price from attributes */
  const currentPrice = attributeValues?.sale?.value || 0;
  const originalPrice = attributeValues?.price?.value || 0;

  /** If no prices are available, return empty fragment */
  if (!currentPrice && !originalPrice) {
    return <></>;
  }

  /** Format prices with Intl.NumberFormat based on current language */
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
