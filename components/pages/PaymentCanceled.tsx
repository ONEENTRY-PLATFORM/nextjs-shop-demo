import parse from 'html-react-parser';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import type { JSX } from 'react';

/**
 * PaymentCanceled page component that displays when a payment has been canceled.
 * This component renders the payment canceled page with title and content from the CMS,
 * providing users with information about their canceled payment transaction.
 * @param   {object}               props      - Component properties
 * @param   {IPagesEntity}         props.page - Page entity containing payment canceled data from CMS
 * @returns {Promise<JSX.Element>}            PaymentCanceled page with title and content
 */
const PaymentCanceled = async ({
  page,
}: {
  page: IPagesEntity;
}): Promise<JSX.Element> => {
  /** Check if page exists and has localization information */
  if (!page || !page.localizeInfos) {
    /** Fallback content if page data is not available */
    return (
      <div className="flex flex-col pb-5 max-md:max-w-full">
        <h1>Payment Canceled</h1>
        <p>Your payment has been canceled.</p>
      </div>
    );
  }

  /** Extract content from page localizeInfos for rendering */
  const {
    localizeInfos: { title, htmlContent },
  } = page;

  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      {/** Display page title from CMS or fallback to default */}
      <h1 className="mb-3">{title || 'Payment Canceled'}</h1>
      {/** Display page content from CMS or fallback to default text */}
      {htmlContent && htmlContent !== '' ? (
        <div className="mb-6">{parse(htmlContent)}</div>
      ) : (
        <p>Your payment has been canceled.</p>
      )}
    </div>
  );
};

export default PaymentCanceled;
