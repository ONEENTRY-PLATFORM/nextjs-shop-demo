import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { UsePrice } from '@/components/utils';

interface TotalAmountProps {
  lang: string;
  dict: IAttributeValues;
  className: string;
  delivery: IProductsEntity;
}

const TotalAmount: FC<TotalAmountProps> = ({
  lang,
  dict,
  className,
  delivery,
}) => {
  const [cartTotal, setCartTotal] = useState(0);
  const total = useAppSelector((state) => {
    return state.cartReducer.productsData.reduce((total, product, index) => {
      if (product.selected) {
        const p = state.cartReducer.products[index];
        total +=
          (p?.attributeValues?.sale?.value || p?.price) * product.quantity;
      }
      return total;
    }, 0);
  });
  const deliveryPrice = delivery?.price || 0;

  useEffect(() => {
    if (!total) {
      setCartTotal(0);
    } else {
      setCartTotal(total + deliveryPrice);
    }
  }, [total, deliveryPrice]);

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
