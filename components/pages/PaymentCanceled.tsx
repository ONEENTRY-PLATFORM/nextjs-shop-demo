import parse from 'html-react-parser';
import type { FC } from 'react';

import type { SimplePageProps } from '@/app/types/global';

/**
 * PaymentCanceled page
 * @param page
 *
 * @returns PaymentCanceled page
 */
const PaymentCanceled: FC<SimplePageProps> = async ({ page }) => {
  if (!page || !page.localizeInfos) {
    return (
      <div className="flex flex-col pb-5 max-md:max-w-full">
        <h1>Payment Canceled</h1>
        <p>Your payment has been canceled.</p>
      </div>
    );
  }

  // Extract content from page localizeInfos
  const {
    localizeInfos: { title, htmlContent },
  } = page;

  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <h1 className="mb-3">{title || 'Payment Canceled'}</h1>
      {htmlContent && htmlContent !== '' ? (
        <div className="mb-6">{parse(htmlContent)}</div>
      ) : (
        <p>Your payment has been canceled.</p>
      )}
    </div>
  );
};

export default PaymentCanceled;
