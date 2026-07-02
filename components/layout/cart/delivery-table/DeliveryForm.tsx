'use client';

import { useTransitionRouter } from 'next-transition-router';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';

import SlideUpTransition from '@/app/animations/SlideUpTransition';
import PaymentButton from '@/components/layout/cart/components/PaymentButton';
import TotalAmount from '@/components/layout/cart/components/TotalAmount';
import DeliveryTable from '@/components/layout/cart/delivery-table/DeliveryTable';

/**
 * Delivery form component for collecting delivery information from the user
 * Contains delivery table and payment button to proceed to payment page
 * Handles form submission and navigation to payment page
 * @param   {object}           props              - Component props
 * @param   {string}           props.lang         - Current language shortcode for localization
 * @param   {IAttributeValues} props.dict         - Dictionary with localized values from server API
 * @param   {IProductsEntity}  props.deliveryData - Represents a delivery product entity object with delivery options
 * @returns {JSX.Element}                         Delivery form with table and payment button
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
  /** Router with transition animations for smooth navigation */
  const router = useTransitionRouter();

  return (
    /* Main form container with submit handler for payment navigation */
    <form
      className="flex max-w-full flex-col pb-5"
      onSubmit={(e) => {
        /** Prevent default form submission behavior */
        e.preventDefault();
        /**
         * Navigate to the locale-prefixed payment page. The leading-slash path
         * must include `lang` — pushing a bare `/payment` matches the single
         * `[lang]` segment (lang="payment") and flashes the home page skeleton
         * before the locale redirect kicks in.
         */
        router.push(`/${lang}/payment`);
      }}
      // test id for e2e testing
      data-testid="checkout-form"
    >
      {/** Delivery table with form fields for delivery information */}
      <DeliveryTable
        lang={lang}
        dict={dict}
        delivery={deliveryData as IProductsEntity}
      />

      {/** Total amount and payment button section */}
      <div id="total" className="mt-4 flex w-full flex-col">
        {/** Display total order amount with slide-up entrance on page transitions */}
        <SlideUpTransition className="flex self-center" index={10}>
          <TotalAmount
            lang={lang}
            dict={dict}
            className="flex text-lg leading-6 font-bold text-slate-700"
          />
        </SlideUpTransition>

        {/** Payment button to proceed to payment page */}
        <PaymentButton
          text={dict.go_to_pay_placeholder?.value as string}
          className="self-end max-lg:self-center"
        />
      </div>
    </form>
  );
};

export default DeliveryForm;
