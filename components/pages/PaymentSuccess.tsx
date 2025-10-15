import parse from 'html-react-parser';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import type { JSX } from 'react';

/**
 * PaymentSuccess page component that displays when a payment has been processed successfully.
 * This component renders the payment success page with title and content from the CMS,
 * providing users with confirmation of their successful payment transaction.
 * @param   {object}               props      - Component properties
 * @param   {IPagesEntity}         props.page - Page entity containing payment success data from CMS
 * @returns {Promise<JSX.Element>}            PaymentSuccess page with title and content
 */
const PaymentSuccess = async ({
  page,
}: {
  page: IPagesEntity;
}): Promise<JSX.Element> => {
  /** Check if page exists and has localization information */
  if (!page || !page.localizeInfos) {
    /** Fallback content if page data is not available */
    return (
      <div className="flex flex-col pb-5 max-md:max-w-full">
        <h1>Payment Success</h1>
        <p>Your payment has been processed successfully.</p>
      </div>
    );
  }

  /** Extract content from page localizeInfos for rendering with default fallbacks */
  const {
    localizeInfos: {
      title = 'Payment Success',
      htmlContent = 'Your payment has been processed successfully.',
    },
  } = page;

  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      {/** Display page title from CMS or fallback to default */}
      <h1 className="mb-3">{title || 'Payment Success'}</h1>
      {/** Display page content from CMS if available */}
      {htmlContent && htmlContent !== '' && (
        <div className="mb-6">{parse(htmlContent)}</div>
      )}
    </div>
  );
};

export default PaymentSuccess;
