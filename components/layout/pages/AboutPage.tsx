import { Suspense } from 'react';

import Loader from '@/components/shared/Loader';

const AboutPage = () => {
  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <Suspense fallback={<Loader />}>About Page</Suspense>
    </div>
  );
};

export default AboutPage;
