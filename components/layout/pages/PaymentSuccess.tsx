import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import type { FC } from 'react';
import { Suspense } from 'react';

import Loader from '@/components/shared/Loader';

const PaymentSuccess: FC<{ page: IPagesEntity }> = async ({ page }) => {
  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <Suspense fallback={<Loader />}>
        <h1 className="">Payment Success </h1>
      </Suspense>
    </div>
  );
};

export default PaymentSuccess;
