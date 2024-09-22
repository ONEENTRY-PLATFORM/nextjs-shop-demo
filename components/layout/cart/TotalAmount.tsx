import React, { useEffect, useState } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { UsePrice } from '@/components/utils';

const TotalAmount = ({ className }: { className: string }) => {
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

  const formattedPrice = UsePrice({
    amount: cartTotal,
    currency: 'USD',
  });

  return (
    <div className={'self-center ' + className}>
      Total amount: {formattedPrice}
    </div>
  );
};

export default TotalAmount;
