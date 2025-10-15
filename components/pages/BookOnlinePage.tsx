/* eslint-disable jsdoc/no-undefined-types */
import parse from 'html-react-parser';
import type { JSX } from 'react';

import type { SimplePageProps } from '@/app/types/global';

/**
 * BookOnlinePage component that displays the online booking page content.
 * This component renders the online booking page with title and content from the CMS,
 * providing users with information and options for booking services online.
 * @param   {object}               props      - Component properties
 * @param   {IPagesEntity}         props.page - Page entity containing booking page data from CMS
 * @returns {Promise<JSX.Element>}            BookOnlinePage component with title and content
 */
const BookOnlinePage = async ({
  page,
}: SimplePageProps): Promise<JSX.Element> => {
  /** Check if page exists and has localization information */
  if (!page || !page.localizeInfos) {
    /** Fallback content if page data is not available */
    return (
      <div className="flex flex-col pb-5 max-md:max-w-full">
        <h1>Book Online</h1>
        <p>Online booking page content.</p>
      </div>
    );
  }

  /** Extract content from page localizeInfos for rendering */
  const { localizeInfos } = page;

  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <div className="flex flex-col">
        {/** Display page title from CMS or fallback to default */}
        <h1 className="mb-3">{localizeInfos?.title || 'Book Online'}</h1>
        {/** Display page content from CMS or fallback to default text */}
        {localizeInfos?.htmlContent ? (
          <div className="mb-6">{parse(localizeInfos.htmlContent)}</div>
        ) : (
          <p>Online booking page content.</p>
        )}
      </div>
    </div>
  );
};

export default BookOnlinePage;
