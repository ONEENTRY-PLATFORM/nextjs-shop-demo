import { Suspense } from 'react';

import Loader from '@/components/shared/Loader';

const ContactsPage = () => {
  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <Suspense fallback={<Loader />}>Contacts Page</Suspense>
    </div>
  );
};

export default ContactsPage;
