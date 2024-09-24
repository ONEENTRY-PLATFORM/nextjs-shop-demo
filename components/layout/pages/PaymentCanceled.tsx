// PaymentCanceled.tsx
import type { FC } from 'react';
import { Suspense } from 'react';

import Loader from '@/components/shared/Loader';

const PaymentCanceled: FC = async () => {
  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <Suspense fallback={<Loader />}>
        <h1 className="">Payment Canceled</h1>
      </Suspense>
    </div>
  );
};

export default PaymentCanceled;
