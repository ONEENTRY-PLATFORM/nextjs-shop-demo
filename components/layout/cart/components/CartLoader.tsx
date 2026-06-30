import type { JSX } from 'react';

import WithSidebarLoader from '@/components/layout/sidebar/components/WithSidebarLoader';

/**
 * CartLoader — skeleton placeholder for the cart page. Renders inside the
 * shared {@link WithSidebarLoader} (sidebar + main area) and mirrors the cart
 * content: a list of product rows (`.product-in-cart`) and the delivery /
 * totals block — so the layout doesn't shift when the real page replaces the
 * transition overlay.
 * @param   {object}      props       - Component props.
 * @param   {number}      props.limit - Number of product-row placeholders.
 * @returns {JSX.Element}             Animated skeleton for the cart page.
 */
const CartLoader = ({ limit = 3 }: { limit?: number }): JSX.Element => {
  return (
    <WithSidebarLoader>
      <div className="w-182.5 max-w-full">
        <div className="flex flex-col gap-4">
          {/** Cart product rows */}
          <div className="flex flex-col gap-4">
            {Array.from(Array(limit).keys()).map((item) => (
              <div
                key={item}
                className="flex w-full justify-between gap-5 bg-white max-md:flex-wrap"
              >
                {/** Info block: checkbox + image + title/price */}
                <div className="relative flex justify-between gap-5">
                  {/** Checkbox */}
                  <div className="animate-loader my-auto size-5 shrink-0 rounded-md" />
                  {/** Product image */}
                  <div className="animate-loader h-37.5 w-32.5 shrink-0 rounded-xl" />
                  {/** Title + price */}
                  <div className="flex flex-col gap-5 self-start">
                    <div className="animate-loader h-6 w-40 rounded-full" />
                    <div className="animate-loader h-6 w-24 rounded-full" />
                  </div>
                </div>

                {/** Controls: quantity selector + delete */}
                <div className="flex items-center gap-5 self-start max-sm:ml-8">
                  <div className="animate-loader h-10.5 w-28 rounded-3xl" />
                  <div className="animate-loader size-10 shrink-0 rounded-full" />
                </div>
              </div>
            ))}
          </div>

          {/** Delivery table + totals + pay button */}
          <div className="flex flex-col pb-5">
            <div className="animate-loader h-40 w-full rounded-2xl" />
            <div className="mt-4 flex w-full flex-col gap-3">
              <div className="animate-loader h-6 w-32 self-center rounded-full" />
              <div className="animate-loader h-11 w-48 self-end rounded-full max-lg:self-center" />
            </div>
          </div>
        </div>
      </div>
    </WithSidebarLoader>
  );
};

export default CartLoader;
