import React from 'react';

interface LoaderProps {
  data?: Record<string, unknown>;
  limit?: number;
}

const Loader: React.FC<LoaderProps> = ({ data = {} }) => {
  return (
    <div className="relative aspect-square size-full max-h-[550px] overflow-hidden">
      ...Loading
    </div>
  );
};

export const ProductsGridLoader: React.FC<LoaderProps> = ({
  data = {},
  limit = 10,
}) => {
  const cls =
    'relative flex size-full flex-col min-h-[360px] items-center rounded-3xl bg-neutral-100 p-4';

  return (
    <div className="relative box-border flex w-full shrink-0 flex-col">
      <section className="relative mx-auto box-border flex min-h-[100px] w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 max-md:w-full">
          {Array.from(Array(limit).keys()).map((item) => (
            <div key={item} className={cls} />
          ))}
        </div>
        <div className="mt-5 flex w-full justify-center">
          {/* <Pagination totalPages={totalPages} /> */}
        </div>
      </section>
    </div>
  );
};

export default Loader;
