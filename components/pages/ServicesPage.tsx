/* eslint-disable jsdoc/no-undefined-types */
import parse from 'html-react-parser';
import type { JSX } from 'react';

import type { SimplePageProps } from '@/app/types/global';

/**
 * Services page component that displays information about offered services.
 * This component renders the services page with title and content from the CMS,
 * providing users with details about the services provided by the business.
 * @param   {SimplePageProps} props        - Component properties
 * @param   {IPagesEntity}    [props.page] - Page entity containing services data from CMS
 * @returns {JSX.Element}                  Services page with title and content
 */
const ServicesPage = ({ page }: SimplePageProps): JSX.Element => {
  /** Check if page exists and has localization information */
  if (!page || !page.localizeInfos) {
    /** Fallback content if page data is not available */
    return (
      <div className="flex flex-col pb-5 max-md:max-w-full">
        <h1>Services</h1>
        <p>Services page content.</p>
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
      <h1 className="">{title || 'Services'}</h1>
      {/** Display page content from CMS or fallback to default text */}
      {htmlContent && htmlContent !== '' ? (
        <div className="mb-6">{parse(htmlContent)}</div>
      ) : (
        <p>Services page content.</p>
      )}
    </div>
  );
};

export default ServicesPage;
