import parse from 'html-react-parser';
import type { FC } from 'react';

import type { SimplePageProps } from '@/app/types/global';
import ContactUsForm from '@/components/forms/ContactUsForm';

/**
 * AuthError page
 * @param page
 * @param lang Current language shortcode
 *
 * @returns AuthError page
 */
const ContactsPage: FC<SimplePageProps> = async ({ page, lang }) => {
  // Более надежная проверка на наличие страницы
  if (!page || !page.localizeInfos) {
    return (
      <div className="flex flex-col pb-5 max-md:max-w-full">
        <div className="flex flex-col items-center">
          <h1>Contact Us</h1>
          <p>Contact information and form.</p>
          <ContactUsForm lang={lang as string} />
        </div>
      </div>
    );
  }

  // Extract content from page localizeInfos
  const { localizeInfos } = page;

  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <div className="flex flex-col items-center">
        <h1 className="mb-3">{localizeInfos?.title || 'Contact Us'}</h1>
        {localizeInfos?.htmlContent ? (
          <div className="mb-6">{parse(localizeInfos.htmlContent)}</div>
        ) : (
          <p>Contact information and form.</p>
        )}
        <ContactUsForm lang={lang as string} />
      </div>
    </div>
  );
};

export default ContactsPage;
