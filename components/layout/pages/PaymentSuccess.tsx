// PaymentSuccess.tsx
import type { FC } from 'react';
import { Suspense } from 'react';

import Loader from '@/components/shared/Loader';

const PaymentSuccess: FC = async () => {
  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <Suspense fallback={<Loader />}>
        <h1 className="">Payment Success </h1>
      </Suspense>
    </div>
  );
};

export default PaymentSuccess;
