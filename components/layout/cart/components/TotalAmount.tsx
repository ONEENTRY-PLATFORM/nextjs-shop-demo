import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { FC } from 'react';
import { useLayoutEffect, useState } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { selectCartTotal } from '@/app/store/reducers/CartSlice';
import { UsePrice } from '@/components/utils';

import TableRowAnimations from '../animations/TableRowAnimations';

interface TotalAmountProps {
  lang: string;
  dict: IAttributeValues;
  className: string;
}

/**
 * Total amount price of all products in cart
 * @param lang Current language shortcode
 * @param dict dictionary from server api
 * @param className CSS className of ref elements
 *
 * @returns
 */
const TotalAmount: FC<TotalAmountProps> = ({ lang, dict, className }) => {
  const [cartTotal, setCartTotal] = useState(0);
  const total = useAppSelector(selectCartTotal);
  const deliveryPrice = useAppSelector((state) => {
    return state.cartReducer.delivery?.price || 0;
  });

  // set total on data change
  useLayoutEffect(() => {
    if (!total) {
      setCartTotal(0);
    } else {
      setCartTotal(total + deliveryPrice);
    }
  }, [total, deliveryPrice]);

  return (
    <TableRowAnimations className={className} index={12}>
      {dict?.order_info_total.value}:{' '}
      {UsePrice({
        amount: cartTotal,
        lang,
      })}
    </TableRowAnimations>
  );
};

export default TotalAmount;
