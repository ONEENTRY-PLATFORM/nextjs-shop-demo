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

/**
 * Order products table
 * @param lang current language shortcode
 *
 * @returns JSX.Element
 */
const OrderProductsTable: FC<PaymentMethodProps> = ({ lang }) => {
  const productsDataInCart = useAppSelector(selectCartData) as Array<{
    id: number;
    quantity: number;
    selected: boolean;
  }>;
  const productsInCart = useAppSelector(
    selectCartItems,
  ) as Array<IProductsEntity>;
  const delivery = useAppSelector((state) => state.cartReducer.delivery);

  return (
    <>
      {/* head row */}
      <div className="flex border-b border-solid p-2">
        <div className="w-1/2 font-bold">Product</div>
        <div className="w-1/4 font-bold">Price</div>
        <div className="w-1/4 font-bold">Quantity</div>
      </div>

      {/* products row */}
      {productsDataInCart.map((product, i) => {
        if (!productsInCart[i]) {
          return;
        }
        const { selected, quantity } = product;
        const { localizeInfos, price, attributeValues } = productsInCart[i];

        if (!selected) {
          return;
        }
        return (
          <div key={i} className="-mt-px flex border-b border-solid p-2">
            <div className="w-1/2">{localizeInfos?.title}</div>
            <div className="w-1/4">
              {UsePrice({
                amount: attributeValues.sale?.value || price,
                lang,
              })}
            </div>
            <div className="w-1/4">{quantity}</div>
          </div>
        );
      })}

      {/* delivery row */}
      {delivery && (
        <div className="-mt-px flex border-b border-solid p-2">
          <div className="w-1/2">{delivery.localizeInfos?.title}</div>
          <div className="w-1/4">
            {UsePrice({ amount: delivery.price, lang })}
          </div>
          <div className="w-1/4"></div>
        </div>
      )}
    </>
  );
};

export default OrderProductsTable;
