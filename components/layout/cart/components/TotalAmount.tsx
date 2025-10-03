import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { selectCartTotal } from '@/app/store/reducers/CartSlice';
import { UsePrice } from '@/components/utils/utils';

import TableRowAnimations from '../animations/TableRowAnimations';

/**
 * Total amount props
 *
 * @property lang - Current language shortcode
 * @property dict - dictionary from server api
 * @property className - CSS className of ref elements
 */
interface TotalAmountProps {
  lang: string;
  dict: IAttributeValues;
  className: string;
}

/**
 * Total amount price of all products in cart
 *
 * @param props - Total amount props
 * @param props.lang - Current language shortcode
 * @param props.dict - dictionary from server api
 * @param props.className - CSS className of ref elements
 *
 * @returns Total amount component
 */
const TotalAmount: FC<TotalAmountProps> = ({ lang, dict, className }) => {
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
