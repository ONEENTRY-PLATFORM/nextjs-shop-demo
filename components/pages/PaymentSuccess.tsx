import type { FC } from 'react';
import { Suspense } from 'react';

import type { SimplePageProps } from '@/app/types/global';
import Loader from '@/components/shared/Loader';

const PaymentSuccess: FC<SimplePageProps> = async ({ page }) => {
  if (!page) {
    return;
  }
  const { localizeInfos } = page;
  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <Suspense fallback={<Loader />}>
        <h1 className="">{localizeInfos.title}</h1>
      </Suspense>
    </div>
  );
};

export default PaymentSuccess;
