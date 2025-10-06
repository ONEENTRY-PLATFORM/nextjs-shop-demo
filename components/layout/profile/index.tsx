/* eslint-disable jsdoc/no-undefined-types */
import type { JSX } from 'react';
import { Suspense } from 'react';

import type { SimplePageProps } from '@/app/types/global';
import UserForm from '@/components/forms/UserForm';
import Loader from '@/components/shared/Loader';

/**
 * Profile page
 * @param   {object}               props      - Profile page props
 * @param   {string}               props.lang - Current language shortcode
 * @param   {IAttributeValues}     props.dict - dictionary from server api
 * @returns {Promise<JSX.Element>}            Profile page component
 */
const ProfilePage = async ({
  lang,
  dict,
}: SimplePageProps): Promise<JSX.Element> => {
  if (!dict) {
    return <Loader />;
  }
  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <Suspense fallback={<Loader />}>
        <UserForm lang={lang as string} dict={dict} />
      </Suspense>
    </div>
  );
};

export default ProfilePage;
