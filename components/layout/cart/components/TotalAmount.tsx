import React, { useEffect, useState } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { UsePrice } from '@/components/utils';

const TotalAmount = ({ className }: { className: string }) => {
  const [cartTotal, setCartTotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState('');
  const total = useAppSelector((state) => {
    return state.cartReducer.products.reduce((total, item) => {
      if (item.selected) {
        total +=
          (item.attributeValues.sale?.value || item.price) * item.quantity;
      }
      return total;
    }, 0);
  });
  const { order_info_total } = useAppSelector(
    (state) => state.systemContentReducer.content,
  );
  const formattedPrice = UsePrice({
    amount: cartTotal,
    currency: 'USD',
  });

  useEffect(() => {
    if (!total) {
      return;
    }
    setCartTotal(total);
  }, [total]);

  useEffect(() => {
    if (order_info_total) {
      setTotalAmount(order_info_total.value);
    }
  }, [order_info_total]);

  // order_info_total
  return (
    <div className={className}>
      {totalAmount}: {formattedPrice}
    </div>
  );
};

export default TotalAmount;
