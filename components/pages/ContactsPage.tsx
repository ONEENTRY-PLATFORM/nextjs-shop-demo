import parse from 'html-react-parser';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import type { FC, Key } from 'react';

import ContactUsForm from '@/components/forms/ContactUsForm';

const ContactsPage: FC<{ page: IPagesEntity; lang: string }> = async ({
  page,
  lang,
}) => {
  const { localizeInfos, forms } = page;
  const { title, htmlContent } = localizeInfos;

  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <div className="flex flex-col items-center">
        <h1 className="mb-3">{title}</h1>
        {htmlContent && <div className="mb-6">{parse(htmlContent)}</div>}
        {forms?.map((form: string, i: Key) => {
          if (form === 'contact_us') {
            return <ContactUsForm key={i} className="" />;
          }
        })}
      </div>
    </div>
  );
};

export default ContactsPage;
