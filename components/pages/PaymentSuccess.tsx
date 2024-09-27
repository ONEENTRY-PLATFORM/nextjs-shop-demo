import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import type { FC } from 'react';
import { Suspense } from 'react';

import Loader from '@/components/shared/Loader';

const PaymentSuccess: FC<{ page: IPagesEntity; lang: string }> = async ({
  page,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  lang,
}) => {
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
