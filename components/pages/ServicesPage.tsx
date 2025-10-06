/* eslint-disable jsdoc/no-undefined-types */
import parse from 'html-react-parser';
import type { JSX } from 'react';

import type { SimplePageProps } from '@/app/types/global';

/**
 * Services page.
 * @param   {SimplePageProps} props        - Page props.
 * @param   {IPagesEntity}    [props.page] - Page entity.
 * @returns {JSX.Element}                  Services page.
 */
const ServicesPage = ({ page }: SimplePageProps): JSX.Element => {
  if (!page || !page.localizeInfos) {
    return (
      <div className="flex flex-col pb-5 max-md:max-w-full">
        <h1>Services</h1>
        <p>Services page content.</p>
      </div>
    );
  }

  // Extract content from page localizeInfos
  const {
    localizeInfos: { title, htmlContent },
  } = page;

  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <h1 className="">{title || 'Services'}</h1>
      {htmlContent && htmlContent !== '' ? (
        <div className="mb-6">{parse(htmlContent)}</div>
      ) : (
        <p>Services page content.</p>
      )}
    </div>
  );
};

export default ServicesPage;
