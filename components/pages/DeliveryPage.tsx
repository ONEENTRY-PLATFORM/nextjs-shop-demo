import parse from 'html-react-parser';
import type { JSX } from 'react';

import type { SimplePageProps } from '@/app/types/global';

/**
 * DeliveryPage page.
 *
 * @param props - Props for DeliveryPage.
 * @param props.page - Page entity.
 * @param props.lang - Current language shortcode.
 *
 * @returns DeliveryPage page.
 */
const DeliveryPage = async ({
  page,
}: SimplePageProps): Promise<JSX.Element> => {
  // Более надежная проверка на наличие страницы
  if (!page || !page.localizeInfos) {
    return (
      <div className="flex flex-col pb-5 max-md:max-w-full">
        <h1>Delivery Information</h1>
        <p>Delivery information page content.</p>
      </div>
    );
  }

  // Extract content from page localizeInfos
  const {
    localizeInfos: { title, htmlContent },
  } = page;

  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <h1 className="mb-3">{title || 'Delivery Information'}</h1>
      {htmlContent && htmlContent !== '' ? (
        <div className="mb-6">{parse(htmlContent)}</div>
      ) : (
        <p>Delivery information page content.</p>
      )}
    </div>
  );
};

export default DeliveryPage;
