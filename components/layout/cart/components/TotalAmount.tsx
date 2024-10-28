import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { UsePrice } from '@/components/utils';

const TotalAmount: FC<{
  lang: string;
  dict: IAttributeValues;
  className: string;
}> = ({ lang, dict, className }) => {
  const [cartTotal, setCartTotal] = useState(0);
  // const total = useAppSelector((state) => {
  //   return state.cartReducer.products.reduce((total, item) => {
  //     if (item.selected) {
  //       total +=
  //         (item.attributeValues.sale?.value || item.price) * item.quantity;
  //     }
  //     return total;
  //   }, 0);
  // });
  const total = 0;

  useEffect(() => {
    if (!total) {
      return;
    }
    setCartTotal(total);
  }, [total]);

  return (
    <div className={className}>
      {dict?.order_info_total.value}:{' '}
      {UsePrice({
        amount: cartTotal,
        lang,
      })}
    </div>
  );
};

export default TotalAmount;
