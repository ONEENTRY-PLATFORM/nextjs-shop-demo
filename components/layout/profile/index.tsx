import type { FC } from 'react';
import { Suspense } from 'react';

import type { SimplePageProps } from '@/app/types/global';
import UserForm from '@/components/forms/UserForm';
import Loader from '@/components/shared/Loader';

/**
 * Profile page
 *
 * @param lang Current language shortcode
 * @param dict dictionary from server api
 *
 * @returns Profile page
 */
const ProfilePage: FC<SimplePageProps> = async ({ lang, dict }) => {
  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <Suspense fallback={<Loader />}>
        <UserForm lang={lang} dict={dict} />
      </Suspense>
    </div>
  );
};

export default ProfilePage;
