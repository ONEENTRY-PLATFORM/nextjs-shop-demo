'use client';

import { useTransitionRouter } from 'next-transition-router';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';

import PaymentButton from '@/components/layout/cart/components/PaymentButton';
import TotalAmount from '@/components/layout/cart/components/TotalAmount';
import DeliveryTable from '@/components/layout/cart/delivery-table/DeliveryTable';

/**
 * Delivery form.
 * @param   {object}           props              - Component props.
 * @param   {string}           props.lang         - Current language shortcode.
 * @param   {IAttributeValues} props.dict         - dictionary from server api.
 * @param   {IProductsEntity}  props.deliveryData - Represents a delivery product entity object.
 * @returns {JSX.Element}                         delivery form.
 */
const DeliveryForm = ({
  lang,
  dict,
  deliveryData,
}: {
  lang: string;
  dict: IAttributeValues;
  deliveryData: IProductsEntity;
}): JSX.Element => {
  const router = useTransitionRouter();

  return (
    <form
      className="flex max-w-full flex-col pb-5"
      onSubmit={(e) => {
        e.preventDefault();
        router.push('/payment');
      }}
    >
      <DeliveryTable
        lang={lang}
        dict={dict}
        delivery={deliveryData as IProductsEntity}
      />
      <div id="total" className="mt-4 flex w-full flex-col">
        <TotalAmount
          lang={lang}
          dict={dict}
          // deliveryData={deliveryData}
          className="flex self-center text-lg font-bold leading-6 text-slate-700 lg:self-end"
        />
        <PaymentButton
          text={dict.go_to_pay_placeholder?.value}
          className="self-end max-lg:self-center"
        />
      </div>
    </form>
  );
};

export default DeliveryForm;
