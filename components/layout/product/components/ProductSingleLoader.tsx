import type { JSX } from 'react';

/**
 * ProductSingleLoader — skeleton placeholder for the single product page.
 * Mirrors the three-column layout of {@link ../index.tsx ProductSingle}
 * (image gallery, variations + description, details) followed by reviews and
 * a related-products row, so the layout doesn't jump when real data arrives.
 * @returns {JSX.Element} Animated skeleton for the product page.
 */
const ProductSingleLoader = (): JSX.Element => {
  return (
    <section className="relative mx-auto box-border flex w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
      {/** Product — three columns (matches ProductSingle) */}
      <div className="flex flex-row gap-10 max-md:max-w-full max-md:gap-4 max-sm:flex-wrap">
        {/** col-1 — image gallery */}
        <div className="relative mb-10 flex min-h-70 w-[30%] grow flex-col max-md:mb-4 max-md:w-4/12 max-md:max-w-[48%] max-sm:w-full max-sm:max-w-full">
          <div className="animate-loader aspect-square w-full rounded-3xl" />
          {/** thumbnails row */}
          <div className="mt-4 flex gap-3">
            {Array.from(Array(4).keys()).map((item) => (
              <div key={item} className="animate-loader size-16 rounded-xl" />
            ))}
          </div>
        </div>

        {/** col-2 — variations carousel + description */}
        <div className="flex w-4/12 grow flex-col max-md:w-4/12 max-sm:w-full">
          {/** variations carousel */}
          <div className="mb-6 flex gap-3">
            {Array.from(Array(3).keys()).map((item) => (
              <div
                key={item}
                className="animate-loader h-24 w-1/3 rounded-2xl"
              />
            ))}
          </div>
          {/** description lines */}
          <div className="flex flex-col gap-3">
            <div className="animate-loader h-5 w-1/2 rounded-full" />
            <div className="animate-loader h-4 w-full rounded-full" />
            <div className="animate-loader h-4 w-full rounded-full" />
            <div className="animate-loader h-4 w-5/6 rounded-full" />
            <div className="animate-loader h-4 w-2/3 rounded-full" />
          </div>
        </div>

        {/** col-3 — details (title, price, button, attributes) */}
        <div className="flex w-3/12 flex-col gap-4 pt-1.5 max-md:mb-10 max-md:w-4/12 max-sm:w-full">
          {/** title */}
          <div className="animate-loader h-7 w-3/4 rounded-full" />
          {/** price */}
          <div className="animate-loader h-9 w-1/2 rounded-full" />
          {/** add-to-cart button */}
          <div className="animate-loader h-12 w-full rounded-full" />
          {/** attribute rows */}
          <div className="mt-2 flex flex-col gap-3">
            {Array.from(Array(4).keys()).map((item) => (
              <div
                key={item}
                className="animate-loader h-4 w-full rounded-full"
              />
            ))}
          </div>
        </div>
      </div>

      {/** Reviews placeholder */}
      <div className="mb-10 flex flex-col gap-4">
        <div className="animate-loader h-6 w-40 rounded-full" />
        <div className="animate-loader h-24 w-full rounded-2xl" />
      </div>

      {/** Related products row */}
      <div className="mb-10 grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
        {Array.from(Array(5).keys()).map((item) => (
          <div
            key={item}
            className="animate-loader flex min-h-90 flex-col rounded-3xl"
          />
        ))}
      </div>
    </section>
  );
};

export default ProductSingleLoader;
