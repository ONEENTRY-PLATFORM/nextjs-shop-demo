import type { JSX } from 'react';

import WithSidebarLoader from '@/components/layout/sidebar/components/WithSidebarLoader';

/**
 * ProfileLoader — skeleton for the profile page. Mirrors the real layout: the
 * {@link WithSidebarLoader} (sidebar + main area) with a user-form skeleton
 * (a column of labeled input placeholders and a save button).
 * @param   {object}      props        - Component props.
 * @param   {number}      props.fields - Number of input-row placeholders.
 * @returns {JSX.Element}              Animated skeleton for the profile page.
 */
const ProfileLoader = ({ fields = 6 }: { fields?: number }): JSX.Element => {
  return (
    <WithSidebarLoader>
      <div className="flex max-w-xl flex-col gap-5 pb-5 max-md:max-w-full">
        {Array.from(Array(fields).keys()).map((item) => (
          <div key={item} className="flex flex-col gap-2">
            {/** Field label */}
            <div className="animate-loader h-4 w-28 rounded-full" />
            {/** Field input */}
            <div className="animate-loader h-12 w-full rounded-xl" />
          </div>
        ))}

        {/** Save button */}
        <div className="animate-loader mt-2 h-11 w-40 self-start rounded-full" />
      </div>
    </WithSidebarLoader>
  );
};

export default ProfileLoader;
