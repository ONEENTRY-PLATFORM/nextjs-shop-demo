'use client';

import type { IOrderProducts } from 'oneentry/dist/orders/ordersInterfaces';
import type { FC, Key } from 'react';

import { useGetSingleOrderQuery } from '@/app/api';
import { useCreateOrder } from '@/app/api/hooks/useCreateOrder';
import { LanguageEnum } from '@/app/types/enum';
import Loader from '@/components/shared/Loader';

import CancelOrderButton from './components/CancelOrderButton';
import OrderDataTable from './components/OrderDataTable';
import ProductCard from './components/ProductCard';
import RepeatOrderButton from './components/RepeatOrderButton';

const OrderPage: FC<{
  id: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings: Record<string, any> | undefined;
  lang: string;
}> = ({ id, settings, lang }) => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const { data, isLoading, refetch } = useGetSingleOrderQuery({
    marker: 'order',
    id: id,
    activeLang: langCode,
  });
  const { onConfirmOrder } = useCreateOrder({ langCode });

  if (!data || !settings) {
    return <Loader />;
  }

  const { currency, products, statusIdentifier, paymentAccountIdentifier } =
    data;

  const { go_to_pay_title, repeat_order_title, cancel_order_title } = settings;

  return (
    <div className="flex flex-col text-[#4C4D56]">
      <div className="flex max-w-[430px] flex-col gap-4 pb-5 max-md:max-w-full">
        {products.map((product: IOrderProducts, i: Key) => {
          if (product.id === 83) {
            return;
          }
          return (
            <ProductCard
              settings={settings}
              key={i}
              product={product}
              currency={currency}
            />
          );
        })}
      </div>
      <OrderDataTable settings={settings} data={data} />
      <div className="flex gap-4">
        {statusIdentifier !== 'created' && (
          <RepeatOrderButton
            data={data}
            title={repeat_order_title.value}
            isLoading={isLoading}
          />
        )}
        {statusIdentifier === 'created' && (
          <CancelOrderButton
            data={data}
            title={cancel_order_title.value}
            isLoading={isLoading}
            refetch={refetch}
          />
        )}
        {paymentAccountIdentifier === 'stripe' &&
          statusIdentifier === 'created' && (
            <button
              className="btn btn-sm btn-o btn-o-primary"
              onClick={onConfirmOrder}
            >
              {go_to_pay_title.value}
            </button>
          )}
      </div>
    </div>
  );
};

export default OrderPage;
