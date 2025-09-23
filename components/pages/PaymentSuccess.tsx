import parse from 'html-react-parser';
import type { FC } from 'react';

import type { SimplePageProps } from '@/app/types/global';

/**
 * PaymentSuccess page
 * @param page
 *
 * @returns PaymentSuccess page
 */
const PaymentSuccess: FC<SimplePageProps> = async ({ page }) => {
  // Более надежная проверка на наличие страницы
  if (!page || !page.localizeInfos) {
    return (
      <div className="flex flex-col pb-5 max-md:max-w-full">
        <h1>Payment Success</h1>
        <p>Your payment has been processed successfully.</p>
      </div>
    );
  }

  // Extract content from page localizeInfos
  const {
    localizeInfos: {
      title = 'Payment Success',
      htmlContent = 'Your payment has been processed successfully.',
    },
  } = page;

  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <h1 className="mb-3">{title || 'Payment Success'}</h1>
      {htmlContent && htmlContent !== '' && (
        <div className="mb-6">{parse(htmlContent)}</div>
      )}
    </div>
  );
};

export default PaymentSuccess;
