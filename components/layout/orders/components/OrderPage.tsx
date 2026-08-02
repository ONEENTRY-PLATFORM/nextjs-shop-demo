'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IOrderProducts } from 'oneentry/dist/orders/ordersInterfaces';
import type { JSX } from 'react';

import { useGetSingleOrderQuery } from '@/app/api';
import { toLangCode } from '@/app/types/enum';
import { DELIVERY_PRODUCT_ID } from '@/app/utils/constants';
import { getApiErrorMessage } from '@/app/utils/getApiErrorMessage';
import Loader from '@/components/shared/Loader';

import OrderAnimations from '../animations/OrderAnimations';
import CancelOrderButton from './CancelOrderButton';
import OrderDataTable from './OrderDataTable';
import PayOrderButton from './PayOrderButton';
import ProductCard from './ProductCard';
import RepeatOrderButton from './RepeatOrderButton';

/**
 * Order page component.
 * Displays detailed information about a single order including products, order data, and action buttons.
 * @param   {object}                                         props                - Order page props
 * @param   {number}                                         props.id             - Order id to fetch and display
 * @param   {IAttributeValues}                               props.settings       - Block attribute values with localized texts (may be incomplete — every read is guarded)
 * @param   {string}                                         props.lang           - Current language shortcode for localization
 * @param   {boolean}                                        props.isActive       - Whether this order page is currently active/visible
 * @param   {(id: number, statusIdentifier: string) => void} props.onStatusChange - Callback to sync the parent list row status when the order status changes
 * @returns {JSX.Element}                                                         Order page with products, data table, and action buttons
 */
const OrderPage = ({
  id,
  settings,
  lang,
  isActive,
  onStatusChange,
}: {
  id: number;
  settings: IAttributeValues | undefined;
  lang: string;
  isActive: boolean;
  onStatusChange: (id: number, statusIdentifier: string) => void;
}): JSX.Element => {
  /** Convert short locale to SDK langCode */
  const langCode = toLangCode(lang);

  /** Fetch order data using RTK Query hook */
  const { data, isLoading, refetch, error } = useGetSingleOrderQuery({
    marker: 'order',
    id: id,
    activeLang: langCode,
  });

  /** Show loader while data is being fetched */
  if (isLoading) {
    return (
      <OrderAnimations
        isActive={isActive}
        className={
          'text-foreground flex h-0 flex-col opacity-0 ' +
          (isActive ? 'p-4' : '')
        }
      >
        <Loader />
      </OrderAnimations>
    );
  }

  /** Show error message if order data failed to load */
  if (error || !data) {
    return (
      <OrderAnimations
        isActive={isActive}
        className={
          'text-foreground flex h-0 flex-col opacity-0 ' +
          (isActive ? 'p-4' : '')
        }
      >
        <div className="text-red-500">
          Failed to load order details.{' '}
          {error ? getApiErrorMessage(error, 'Unknown error') : 'Unknown error'}
        </div>
      </OrderAnimations>
    );
  }

  /** Extract relevant data from the order */
  const { products, statusIdentifier, paymentAccountIdentifier } = data;

  /** Extract button titles from settings with English fallbacks — the CMS block may be incomplete */
  const { go_to_pay_title, repeat_order_title, cancel_order_title } =
    settings ?? {};

  /** Render the order page with animations */
  return (
    <OrderAnimations
      isActive={isActive}
      className={
        'text-foreground flex h-0 flex-col opacity-0 ' + (isActive ? 'p-4' : '')
      }
    >
      {/* Product cards section */}
      <div className="flex flex-col gap-4 pb-5 max-md:max-w-full">
        {products?.map((product: IOrderProducts) => {
          /** Skip the delivery product — it is rendered as order data, not as a product card */
          if (product.id === DELIVERY_PRODUCT_ID) {
            return;
          }
          return (
            <ProductCard
              key={product.id}
              settings={settings}
              product={product}
              lang={lang}
              currency={data.currency}
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
            title={(repeat_order_title?.value as string) || 'Repeat order'}
            isLoading={isLoading}
          />
        )}

        {/* Show cancel order button for created orders */}
        {statusIdentifier === 'created' && (
          <CancelOrderButton
            data={data}
            title={(cancel_order_title?.value as string) || 'Cancel order'}
            isLoading={isLoading}
            refetch={refetch}
            onStatusChange={onStatusChange}
          />
        )}

        {/* Show pay order button for created orders with stripe payment */}
        {paymentAccountIdentifier === 'stripe' &&
          statusIdentifier === 'created' && (
            <PayOrderButton
              id={data.id}
              lang={lang}
              title={(go_to_pay_title?.value as string) || 'Go to pay'}
              loading={isLoading}
            />
          )}
      </div>
    </OrderAnimations>
  );
};

export default OrderPage;
