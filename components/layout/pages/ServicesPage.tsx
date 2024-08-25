import { Suspense } from 'react';

const ServicesPage = () => {
  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <Suspense
        fallback={
          <div className="relative aspect-square size-full max-h-[550px] overflow-hidden" />
        }
      >
        Services Page
      </Suspense>
    </div>
  );
};

export default ServicesPage;
