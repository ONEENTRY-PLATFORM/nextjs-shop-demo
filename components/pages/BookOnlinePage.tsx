/* eslint-disable jsdoc/no-undefined-types */
import parse from 'html-react-parser';
import type { JSX } from 'react';

import type { SimplePageProps } from '@/app/types/global';

/**
 * BookOnlinePage page.
 * @param   {object}               props      - Page props.
 * @param   {IPagesEntity}         props.page - Page entity.
 * @returns {Promise<JSX.Element>}            BookOnlinePage component.
 */
const BookOnlinePage = async ({
  page,
}: SimplePageProps): Promise<JSX.Element> => {
  if (!page || !page.localizeInfos) {
    return (
      <div className="flex flex-col pb-5 max-md:max-w-full">
        <h1>Book Online</h1>
        <p>Online booking page content.</p>
      </div>
    );
  }

  // Extract content from page localizeInfos
  const { localizeInfos } = page;

  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <div className="flex flex-col">
        <h1 className="mb-3">{localizeInfos?.title || 'Book Online'}</h1>
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
