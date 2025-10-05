import type { JSX } from 'react';
import { Suspense } from 'react';

import type { SimplePageProps } from '@/app/types/global';
import UserForm from '@/components/forms/UserForm';
import Loader from '@/components/shared/Loader';

/**
 * Profile page
 * @param props      - Profile page props
 * @param props.lang - Current language shortcode
 * @param props.dict - dictionary from server api
 * @returns          Profile page component
 */
const ProfilePage = async ({
  lang,
  dict,
}: SimplePageProps): Promise<JSX.Element> => {
  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <Suspense fallback={<Loader />}>
        <UserForm lang={lang as string} dict={dict} />
      </Suspense>
    </div>
  );
};

export default ProfilePage;
