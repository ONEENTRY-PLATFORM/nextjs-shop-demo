import parse from 'html-react-parser';
import type { FC } from 'react';

import type { SimplePageProps } from '@/app/types/global';

/**
 * DeliveryPage page
 * @param page
 * @param lang Current language shortcode
 *
 * @returns DeliveryPage page
 */
const DeliveryPage: FC<SimplePageProps> = async ({ page }) => {
  if (!page) {
    return;
  }

  // Extract content from page localizeInfos
  const {
    localizeInfos: { title, htmlContent },
  } = page;

  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <div className="flex flex-col">
        <h1 className="mb-3">{title}</h1>
        {htmlContent && <div className="mb-6">{parse(htmlContent)}</div>}
      </div>
    </div>
  );
};

export default DeliveryPage;
