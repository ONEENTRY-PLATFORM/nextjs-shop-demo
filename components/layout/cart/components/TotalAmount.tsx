import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { selectCartTotal } from '@/app/store/reducers/CartSlice';
import { UsePrice } from '@/components/utils/utils';

import TableRowAnimations from '../animations/TableRowAnimations';

/**
 * Total amount price of all products in cart
 * @param   {object}           props           - Total amount props
 * @param   {string}           props.lang      - Current language shortcode
 * @param   {IAttributeValues} props.dict      - dictionary from server api
 * @param   {string}           props.className - CSS className of ref elements
 * @returns {JSX.Element}                      Total amount component
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
  const [cartTotal, setCartTotal] = useState(0);
  const total = useAppSelector(selectCartTotal);
  const delivery = useAppSelector((state) => state.cartReducer.delivery);
  const productsData = useAppSelector(
    (state) => state.cartReducer.productsData,
  );

  // Check if we have products in cart
  const hasProducts =
    productsData && productsData.some((item) => item.selected);

  // set total on data change
  useEffect(() => {
    const deliveryPrice =
      delivery?.attributeValues?.price?.value || delivery?.price || 0;

    if (!hasProducts) {
      setCartTotal(0);
    } else {
      setCartTotal((total as number) + deliveryPrice);
    }
  }, [total, delivery, hasProducts]);

  return (
    <TableRowAnimations className={className} index={12}>
      {dict?.order_info_total?.value}:{' '}
      {UsePrice({
        amount: cartTotal,
        lang,
      })}
    </TableRowAnimations>
  );
};

export default TotalAmount;
