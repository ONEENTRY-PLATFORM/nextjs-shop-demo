import { Suspense } from 'react';

import Loader from '@/components/shared/Loader';

const OrdersPage = () => {
  return (
    <div className="flex max-w-[730px] flex-col pb-5 max-md:max-w-full">
      <Suspense fallback={<Loader />}>Orders Page</Suspense>
    </div>
  );
};

export default OrdersPage;
