import { Suspense } from 'react';

import UserForm from '@/components/forms/UserForm';
import Loader from '@/components/shared/Loader';

const ProfilePage = () => {
  return (
    <div className="flex max-w-[430px] flex-col pb-5 max-md:max-w-full">
      <Suspense fallback={<Loader />}>
        <UserForm />
      </Suspense>
    </div>
  );
};

export default ProfilePage;
