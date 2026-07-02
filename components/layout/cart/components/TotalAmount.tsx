import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';
import { useMemo } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { selectCartTotal } from '@/app/store/reducers/CartSlice';
import { UsePrice } from '@/components/utils/utils';

/**
 * Total amount component that displays the total price of all products in the cart including delivery
 * Calculates and updates the total amount when cart contents or delivery options change
 * @param   {object}           props           - Total amount props
 * @param   {string}           props.lang      - Current language shortcode for price formatting
 * @param   {IAttributeValues} props.dict      - Dictionary with localized values from server API
 * @param   {string}           props.className - CSS className for styling the component
 * @returns {JSX.Element}                      Total amount component with formatted price
 */
const TotalAmount = ({
  lang,
  dict,
  className,
}: {
  lang: string;
  dict: IAttributeValues;
  className: string;
}): JSX.Element => {
  /** Get cart total amount from Redux store */
  const total = useAppSelector(selectCartTotal);

  /** Get selected delivery option from Redux store */
  const delivery = useAppSelector((state) => state.cartReducer.delivery);

  /** Get cart products data from Redux store */
  const productsData = useAppSelector(
    (state) => state.cartReducer.productsData,
  );

  /**
   * Check if we have selected products in cart (memoized)
   */
  const hasProducts = useMemo(
    () => productsData && productsData.some((item) => item.selected),
    [productsData],
  );

  /**
   * Calculate total amount including delivery price (memoized)
   * Adds delivery price to the cart total if there are selected products
   */
  const cartTotal = useMemo(() => {
    /** Extract delivery price from delivery object (handle different data structures) */
    const deliveryPrice =
      (delivery?.attributeValues?.price?.value as number) ||
      delivery?.price ||
      0;

    /** Reset total to 0 if no products are selected */
    if (!hasProducts) {
      return 0;
    }

    /** Calculate total amount including delivery price */
    return (total as number) + deliveryPrice;
  }, [total, delivery, hasProducts]);

  return (
    /** Total amount container; entrance animation is applied by the parent (e.g. SlideUpTransition in DeliveryForm) */
    <div className={className} data-testid="cart-total">
      {dict?.order_info_total?.value as string}:{' '}
      {UsePrice({
        amount: cartTotal,
        lang,
      })}
    </div>
  );
};

export default TotalAmount;
