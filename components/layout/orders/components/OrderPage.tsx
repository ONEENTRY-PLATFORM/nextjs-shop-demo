/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

// import type { IOrderProducts } from 'oneentry/dist/orders/ordersInterfaces';
import type { JSX } from 'react';

import { useGetSingleOrderQuery } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';

import OrderAnimations from '../animations/OrderAnimations';
import CancelOrderButton from './CancelOrderButton';
import OrderDataTable from './OrderDataTable';
import PayOrderButton from './PayOrderButton';
import ProductCard from './ProductCard';
import RepeatOrderButton from './RepeatOrderButton';

/**
 * Order page component.
 * Displays detailed information about a single order including products, order data, and action buttons.
 * @param   {object}      props          - Order page props
 * @param   {number}      props.id       - Order id to fetch and display
 * @param   {object}      props.settings - Settings containing localized texts and configurations
 * @param   {string}      props.lang     - Current language shortcode for localization
 * @param   {boolean}     props.isActive - Whether this order page is currently active/visible
 * @returns {JSX.Element}                Order page with products, data table, and action buttons
 */
const OrderPage = ({
  id,
  settings,
  lang,
  isActive,
}: {
  id: number;
  settings: any;
  lang: string;
  isActive: boolean;
}): JSX.Element => {
  /** Convert language shortcode to enum value for API requests */
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  /** Fetch order data using RTK Query hook */
  const { data, isLoading, refetch } = useGetSingleOrderQuery({
    marker: 'order',
    id: id,
    activeLang: langCode,
  });

  /** Return empty element if data or settings are not available */
  if (!data || !settings) {
    return <></>;
  }

  /** Extract relevant data from the order */
  const { products, statusIdentifier, paymentAccountIdentifier } = data;

  /** Extract button titles from settings */
  const { go_to_pay_title, repeat_order_title, cancel_order_title } = settings;

  /** Render the order page with animations */
  return (
    <OrderAnimations
      isActive={isActive}
      className={
        'flex h-0 opacity-0 flex-col text-[#4C4D56] ' + (isActive ? 'p-4' : '')
      }
    >
      {/* Product cards section */}
      <div className="flex flex-col gap-4 pb-5 max-md:max-w-full">
        {products.map((product: any) => {
          /** Skip product with id 83 (possibly a special case or placeholder) */
          if (product.id === 83) {
            return;
          }
          return (
            <ProductCard
              key={product.id}
              settings={settings}
              product={product}
              lang={lang}
            />
          );
        })}
      </div>

      {/* Order data table with details */}
      <OrderDataTable settings={settings} data={data} lang={lang} />

      {/* Action buttons section based on order status */}
      <div className="flex gap-4">
        {/* Show repeat order button for non-created orders */}
        {statusIdentifier !== 'created' && (
          <RepeatOrderButton
            data={data}
            title={repeat_order_title.value}
            isLoading={isLoading}
          />
        )}

        {/* Show cancel order button for created orders */}
        {statusIdentifier === 'created' && (
          <CancelOrderButton
            data={data}
            title={cancel_order_title.value}
            isLoading={isLoading}
            refetch={refetch}
          />
        )}

        {/* Show pay order button for created orders with stripe payment */}
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
