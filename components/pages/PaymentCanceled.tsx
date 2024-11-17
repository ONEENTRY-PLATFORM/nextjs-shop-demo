import type { FC } from 'react';

import type { SimplePageProps } from '@/app/types/global';

/**
 * PaymentCanceled page
 * @param page
 *
 * @returns PaymentCanceled page
 */
const PaymentCanceled: FC<SimplePageProps> = async ({ page }) => {
  if (!page) {
    return;
  }

  // Extract content from page localizeInfos
  const {
    localizeInfos: { title },
  } = page;

  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <h1 className="">{title}</h1>
    </div>
  );
};

export default PaymentCanceled;
