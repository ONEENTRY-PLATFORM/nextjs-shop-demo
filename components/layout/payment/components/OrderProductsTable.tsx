import type { IAccountsEntity } from 'oneentry/dist/payments/paymentsInterfaces';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { type FC } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import {
  selectCartData,
  selectCartItems,
} from '@/app/store/reducers/CartSlice';
import { UsePrice } from '@/components/utils';

type PaymentMethodProps = {
  account: IAccountsEntity;
  lang: string;
};

const OrderProductsTable: FC<PaymentMethodProps> = ({ lang }) => {
  const productsDataInCart = useAppSelector(selectCartData) as Array<{
    id: number;
    quantity: number;
    selected: boolean;
  }>;
  const productsInCart = useAppSelector(
    selectCartItems,
  ) as Array<IProductsEntity>;

  return (
    <>
      <div className="flex border-b border-solid p-2">
        <div className="w-1/2 font-bold">Product</div>
        <div className="w-1/4 font-bold">Price</div>
        <div className="w-1/4 font-bold">Quantity</div>
      </div>

      {productsDataInCart.map((product, i) => {
        const { selected, quantity } = product;
        if (!productsInCart[i]) {
          return;
        }
        const { localizeInfos, price } = productsInCart[i];
        const title = localizeInfos?.title;
        if (!selected) {
          return;
        }
        return (
          <div key={i} className="-mt-px flex border-b border-solid p-2">
            <div className="w-1/2">{title}</div>
            <div className="w-1/4">{UsePrice({ amount: price, lang })}</div>
            <div className="w-1/4">{quantity}</div>
          </div>
        );
      })}
    </>
  );
};

export default OrderProductsTable;
