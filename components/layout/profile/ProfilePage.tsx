import type { FC } from 'react';
import { Suspense } from 'react';

import { useServerProvider } from '@/app/store/providers/ServerProvider';
import UserForm from '@/components/forms/UserForm';
import Loader from '@/components/shared/Loader';

const ProfilePage: FC = async () => {
  const [lang] = useServerProvider('lang');
  return (
    <div className="flex max-w-[430px] flex-col pb-5 max-md:max-w-full">
      <Suspense fallback={<Loader />}>
        <UserForm lang={lang} />
      </Suspense>
    </div>
  );
};

export default ProfilePage;
