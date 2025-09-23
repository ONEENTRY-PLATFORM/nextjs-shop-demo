import parse from 'html-react-parser';
import type { FC, Key } from 'react';

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
  if (!page) {
    return;
  }

  // Extract content from page localizeInfos
  const {
    localizeInfos: { title, htmlContent },
    forms,
  } = page;

  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <div className="flex flex-col items-center">
        <h1 className="mb-3">{title}</h1>
        {htmlContent && <div className="mb-6">{parse(htmlContent)}</div>}
        {forms?.map((form: string, i: Key) => {
          if (form === 'contact_us') {
            return <ContactUsForm key={i} className="" lang={lang} />;
          }
        })}
      </div>
    </div>
  );
};

export default ContactsPage;
