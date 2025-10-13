import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';

import { ServerProvider } from '@/app/store/providers/ServerProvider';

import BreadcrumbsAnimations from './animations/BreadcrumbsAnimations';
import BackButton from './components/BackButton';
import BreadcrumbsTrail from './components/BreadcrumbsTrail';
import FilterButton from './components/FilterButton';

/**
 * Breadcrumbs navigation component that displays the current page path and navigation controls
 * Provides back navigation, breadcrumb trail, and filter toggle functionality
 * Wrapped with animation component for entrance effects
 * @returns {JSX.Element} Breadcrumbs component with navigation controls
 */
const Breadcrumbs = (): JSX.Element => {
  /** Get language and dictionary data from server provider for localization */
  const [lang] = ServerProvider('lang');
  const [dict] = ServerProvider('dict');

  return (
    /** Wrap breadcrumbs with animation component for entrance effects */
    <BreadcrumbsAnimations className="z-10 mx-auto box-border hidden w-full grow flex-col justify-center self-stretch bg-white px-4 py-2">
      {/** Main breadcrumbs container with max width constraint */}
      <div className="mx-auto flex w-full max-w-(--breakpoint-xl) flex-row justify-between gap-5">
        {/** Left side navigation controls */}
        <div className="mr-auto flex gap-5">
          {/** Back button for navigating to previous page */}
          <BackButton />

          {/** Breadcrumb trail showing current path */}
          <BreadcrumbsTrail lang={lang as string} />
        </div>

        {/** Right side filter toggle button */}
        <FilterButton dict={dict as IAttributeValues} />
      </div>
    </BreadcrumbsAnimations>
  );
};

export default Breadcrumbs;
