import parse from 'html-react-parser';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import type { JSX } from 'react';

/**
 * PaymentCanceled page.
 * @param   {object}               props      - Page props.
 * @param   {IPagesEntity}         props.page - Page entity.
 * @returns {Promise<JSX.Element>}            PaymentCanceled page.
 */
const PaymentCanceled = async ({
  page,
}: {
  page: IPagesEntity;
}): Promise<JSX.Element> => {
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
