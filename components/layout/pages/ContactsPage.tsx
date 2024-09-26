/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import type { FC, Key } from 'react';
import { Suspense } from 'react';

import ContactUsForm from '@/components/forms/ContactUsForm';
import Loader from '@/components/shared/Loader';

const ContactsPage: FC<{ page: IPagesEntity }> = async ({ page }) => {
  const { localizeInfos, forms } = page;
  const { title, htmlContent } = localizeInfos;

  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <Suspense fallback={<Loader />}>
        <h1>{title}</h1>
        {htmlContent && <div>{htmlContent}</div>}
        {forms?.map((form: string, i: Key) => {
          if (form === 'contact_us') {
            return <ContactUsForm key={i} />;
          }
        })}
      </Suspense>
    </div>
  );
};

export default ContactsPage;
