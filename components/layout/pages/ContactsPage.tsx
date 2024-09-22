/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FC, Key } from 'react';
import { Suspense } from 'react';

import ContactUsForm from '@/components/forms/ContactUsForm';
import Loader from '@/components/shared/Loader';

const ContactsPage: FC<{ page: any }> = async ({ page }) => {
  // console.log(page);
  const { localizeInfos, attributeValues, forms, blocks } = page;
  const { title, htmlContent } = localizeInfos;
  const { icon } = attributeValues;
  console.log(blocks);

  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <Suspense fallback={<Loader />}>
        <h1>{title}</h1>
        {htmlContent && <div>{htmlContent}</div>}
        {forms.map((form: string, i: Key) => {
          if (form === 'contact_us') {
            return <ContactUsForm key={i} />;
          }
        })}
      </Suspense>
    </div>
  );
};

export default ContactsPage;
