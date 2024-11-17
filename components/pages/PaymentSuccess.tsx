import type { FC } from 'react';

import type { SimplePageProps } from '@/app/types/global';

/**
 * PaymentSuccess page
 * @param page
 *
 * @returns PaymentSuccess page
 */
const PaymentSuccess: FC<SimplePageProps> = async ({ page }) => {
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

export default PaymentSuccess;
