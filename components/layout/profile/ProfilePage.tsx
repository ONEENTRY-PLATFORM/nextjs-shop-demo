import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import type { FC } from 'react';
import { Suspense } from 'react';

import UserForm from '@/components/forms/UserForm';
import Loader from '@/components/shared/Loader';

const ProfilePage: FC<{ page: IPagesEntity; lang: string }> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  page,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  lang,
}) => {
  return (
    <div className="flex max-w-[430px] flex-col pb-5 max-md:max-w-full">
      <Suspense fallback={<Loader />}>
        <UserForm />
      </Suspense>
    </div>
  );
};

export default ProfilePage;
