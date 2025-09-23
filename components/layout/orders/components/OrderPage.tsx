'use client';

import type { IOrderProducts } from 'oneentry/dist/orders/ordersInterfaces';
import type { FC, Key } from 'react';

import { useGetSingleOrderQuery } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';

import OrderAnimations from '../animations/OrderAnimations';
import CancelOrderButton from './CancelOrderButton';
import OrderDataTable from './OrderDataTable';
import PayOrderButton from './PayOrderButton';
import ProductCard from './ProductCard';
import RepeatOrderButton from './RepeatOrderButton';

/**
 * Order page
 * @param id
 * @param settings
 * @param lang current language shortcode
 * @param isActive
 *
 * @returns JSX.Element
 */
const OrderPage: FC<{
  id: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings: Record<string, any> | undefined;
  lang: string;
  isActive: boolean;
}> = ({ id, settings, lang, isActive }) => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const { data, isLoading, refetch } = useGetSingleOrderQuery({
    marker: 'order',
    id: id,
    activeLang: langCode,
  });

  if (!data || !settings) {
    return;
  }

  const { products, statusIdentifier, paymentAccountIdentifier } = data;
  const { go_to_pay_title, repeat_order_title, cancel_order_title } = settings;

  return (
    <OrderAnimations
      isActive={isActive}
      className={
        'flex h-0 opacity-0 flex-col text-[#4C4D56] ' + (isActive ? 'p-4' : '')
      }
    >
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
              lang={lang}
            />
          );
        })}
      </div>
      <OrderDataTable settings={settings} data={data} lang={lang} />
      <div className="flex gap-4">
        {statusIdentifier !== 'created' && (
          <RepeatOrderButton
            data={data}
            title={repeat_order_title.value}
            isLoading={isLoading}
            lang={lang}
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
            <PayOrderButton
              id={data.id}
              lang={lang}
              title={go_to_pay_title.value}
              loading={isLoading}
            />
          )}
      </div>
    </OrderAnimations>
  );
};

export default OrderPage;
