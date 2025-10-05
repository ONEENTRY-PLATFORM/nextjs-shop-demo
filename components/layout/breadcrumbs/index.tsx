import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';

import { ServerProvider } from '@/app/store/providers/ServerProvider';

import BreadcrumbsAnimations from './animations/BreadcrumbsAnimations';
import BackButton from './components/BackButton';
import BreadcrumbsTrail from './components/BreadcrumbsTrail';
import FilterButton from './components/FilterButton';

/**
 * Breadcrumbs
 * @returns {JSX.Element} Breadcrumbs component.
 */
const Breadcrumbs = (): JSX.Element => {
  // get lang, dict from server provider
  const [lang] = ServerProvider('lang');
  const [dict] = ServerProvider('dict');

  return (
    <BreadcrumbsAnimations className="z-10 mx-auto box-border hidden w-full grow flex-col justify-center self-stretch bg-white px-4 py-2">
      <div className="mx-auto flex w-full max-w-(--breakpoint-xl) flex-row justify-between gap-5">
        <div className="mr-auto flex gap-5">
          <BackButton />
          <BreadcrumbsTrail lang={lang as string} />
        </div>
        <FilterButton dict={dict as IAttributeValues} />
      </div>
    </BreadcrumbsAnimations>
  );
};

export default Breadcrumbs;
