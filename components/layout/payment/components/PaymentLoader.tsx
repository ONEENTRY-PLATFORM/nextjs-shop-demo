import type { JSX } from 'react';

import WithSidebarLoader from '@/components/layout/sidebar/components/WithSidebarLoader';

/**
 * PaymentLoader — skeleton for the payment page. Mirrors the real layout: the
 * {@link WithSidebarLoader} (sidebar + main area) with a column of collapsed
 * payment-method cards (title + description line + the circular expand toggle),
 * so the layout doesn't shift when the real page replaces the transition
 * overlay.
 * @param   {object}      props         - Component props.
 * @param   {number}      props.methods - Number of payment-method placeholders.
 * @returns {JSX.Element}               Animated skeleton for the payment page.
 */
const PaymentLoader = ({ methods = 3 }: { methods?: number }): JSX.Element => {
  return (
    <WithSidebarLoader>
      <div className="flex max-w-182.5 flex-col gap-5 pb-5 max-md:max-w-full">
        {Array.from(Array(methods).keys()).map((item) => (
          <div
            key={item}
            className="relative overflow-hidden rounded-md border border-solid border-neutral-300 p-4"
          >
            {/** Method title */}
            <div className="animate-loader h-5 w-40 rounded-full" />
            {/** Method description */}
            <div className="animate-loader mt-2 mb-4 h-4 w-56 max-w-full rounded-full" />
            {/** Expand toggle */}
            <div className="animate-loader absolute right-4 bottom-4 size-6 rounded-full" />
          </div>
        ))}
      </div>
    </WithSidebarLoader>
  );
};

export default PaymentLoader;
