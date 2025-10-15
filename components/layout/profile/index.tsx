/* eslint-disable jsdoc/no-undefined-types */
import type { JSX } from 'react';
import { Suspense } from 'react';

import type { SimplePageProps } from '@/app/types/global';
import UserForm from '@/components/forms/UserForm';
import Loader from '@/components/shared/Loader';

/**
 * Profile page component that displays user profile information and allows editing.
 * This component serves as a container for the UserForm component and handles
 * loading states when dictionary data is not yet available.
 * @param   {object}               props      - Profile page props
 * @param   {string}               props.lang - Current language shortcode
 * @param   {IAttributeValues}     props.dict - Dictionary from server API containing localized strings
 * @returns {Promise<JSX.Element>}            Profile page component with user form
 */
const ProfilePage = async ({
  lang,
  dict,
}: SimplePageProps): Promise<JSX.Element> => {
  /** Show loader when dictionary data is not available */
  if (!dict) {
    return <Loader />;
  }

  /** Render the profile page with user form */
  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      {/* Suspense boundary to handle loading state for the UserForm component */}
      <Suspense fallback={<Loader />}>
        <UserForm lang={lang as string} dict={dict} />
      </Suspense>
    </div>
  );
};

export default ProfilePage;
