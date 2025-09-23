'use client';

import { useTransitionRouter } from 'next-transition-router';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

import PaymentButton from '@/components/layout/cart/components/PaymentButton';
import TotalAmount from '@/components/layout/cart/components/TotalAmount';
import DeliveryTable from '@/components/layout/cart/delivery-table/DeliveryTable';

interface DeliveryFormProps {
  lang: string;
  dict: IAttributeValues;
  deliveryData: IProductsEntity;
}

/**
 * Delivery form
 * @param lang Current language shortcode
 * @param dict dictionary from server api
 * @param deliveryData Represents a delivery product entity object.
 *
 * @returns delivery form
 */
const DeliveryForm: FC<DeliveryFormProps> = ({ lang, dict, deliveryData }) => {
  const router = useTransitionRouter();

  return (
    <form
      className="flex w-[730px] max-w-full flex-col pb-5"
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
