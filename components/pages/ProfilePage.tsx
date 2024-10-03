import type { FC } from 'react';
import { Suspense } from 'react';

import UserForm from '@/components/forms/UserForm';
import Loader from '@/components/shared/Loader';

const ProfilePage: FC<{ lang: string }> = async ({ lang }) => {
  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <Suspense fallback={<Loader />}>
        <UserForm lang={lang} />
      </Suspense>
    </div>
  );
};

export default ProfilePage;
