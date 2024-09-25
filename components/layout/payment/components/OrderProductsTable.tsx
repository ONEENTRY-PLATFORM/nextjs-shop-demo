import type { IAccountsEntity } from 'oneentry/dist/payments/paymentsInterfaces';
import type { FC } from 'react';

import { useAppSelector } from '@/app/store/hooks';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Loader from '@/components/shared/Loader';

type PaymentMethodProps = {
  account: IAccountsEntity;
};

const OrderProductsTable: FC<PaymentMethodProps> = () => {
  const productsInCart = useAppSelector((state) => state.cartReducer.products);

  return (
    <>
      <div className="flex border-b border-solid p-2">
        <div className="w-1/2 font-bold">Product</div>
        <div className="w-1/4 font-bold">Price</div>
        <div className="w-1/4 font-bold">Quantity</div>
      </div>
      {productsInCart.map((product, i) => {
        const { localizeInfos, selected, quantity, price } = product;
        const title = localizeInfos?.title;
        if (!selected) {
          return;
        }
        return (
          <div key={i} className="-mt-px flex border-b border-solid p-2">
            <div className="w-1/2">{title}</div>
            <div className="w-1/4">{price}</div>
            <div className="w-1/4">{quantity}</div>
          </div>
        );
      })}
    </>
  );
};

export default OrderProductsTable;
