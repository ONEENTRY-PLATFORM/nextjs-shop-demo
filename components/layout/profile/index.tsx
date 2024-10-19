import type { FC } from 'react';
import { Suspense } from 'react';

import type { SimplePageProps } from '@/app/types/global';
import UserForm from '@/components/forms/UserForm';
import Loader from '@/components/shared/Loader';

const ProfilePage: FC<SimplePageProps> = async ({ lang }) => {
  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <Suspense fallback={<Loader />}>
        <UserForm lang={lang} dict={undefined} />
      </Suspense>
    </div>
  );
};

export default ProfilePage;
