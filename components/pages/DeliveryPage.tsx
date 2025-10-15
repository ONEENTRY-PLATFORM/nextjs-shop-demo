/* eslint-disable jsdoc/no-undefined-types */
import parse from 'html-react-parser';
import type { JSX } from 'react';

import type { SimplePageProps } from '@/app/types/global';

/**
 * DeliveryPage component that displays delivery information content.
 * This component renders the delivery information page with title and content from the CMS,
 * providing users with details about shipping and delivery policies.
 * @param   {object}               props      - Component properties
 * @param   {IPagesEntity}         props.page - Page entity containing delivery information data from CMS
 * @returns {Promise<JSX.Element>}            DeliveryPage component with title and content
 */
const DeliveryPage = async ({
  page,
}: SimplePageProps): Promise<JSX.Element> => {
  /** More reliable check for page existence and localization information */
  if (!page || !page.localizeInfos) {
    /** Fallback content if page data is not available */
    return (
      <div className="flex flex-col pb-5 max-md:max-w-full">
        <h1>Delivery Information</h1>
        <p>Delivery information page content.</p>
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
      <h1 className="mb-3">{title || 'Delivery Information'}</h1>
      {/** Display page content from CMS or fallback to default text */}
      {htmlContent && htmlContent !== '' ? (
        <div className="mb-6">{parse(htmlContent)}</div>
      ) : (
        <p>Delivery information page content.</p>
      )}
    </div>
  );
};

export default DeliveryPage;
