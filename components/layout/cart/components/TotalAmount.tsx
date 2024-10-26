import React, { useEffect, useState } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { UsePrice } from '@/components/utils';

const TotalAmount = ({
  lang,
  dict,
  className,
}: {
  lang: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
  className: string;
}) => {
  const [cartTotal, setCartTotal] = useState(0);
  const total = useAppSelector((state) => {
    return state.cartReducer.products.reduce((total, item) => {
      if (item.selected) {
        total +=
          (item.attributeValues.sale?.value || item.price) * item.quantity;
      }
      return total;
    }, 0);
  });

  useEffect(() => {
    if (!total) {
      return;
    }
    setCartTotal(total);
  }, [total]);
  console.log(dict);

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
