import type { FC } from 'react';

import { useServerProvider } from '@/app/store/providers/ServerProvider';

import BreadcrumbsAnimations from './animations/BreadcrumbsAnimations';
import BackButton from './components/BackButton';
import BreadcrumbsTrail from './components/BreadcrumbsTrail';
import FilterButton from './components/FilterButton';

/**
 * Breadcrumbs
 *
 * @componentType Server component
 * @returns JSX.Element
 */
const Breadcrumbs: FC = () => {
  // get lang, dict from server provider
  const [lang] = useServerProvider('lang');
  const [dict] = useServerProvider('dict');

  return (
    <BreadcrumbsAnimations className="z-10 mx-auto box-border hidden w-full grow flex-col justify-center self-stretch bg-white px-4 py-2">
      <div className="mx-auto flex w-full max-w-screen-xl flex-row justify-between gap-5">
        <div className="mr-auto flex gap-5">
          <BackButton />
          <BreadcrumbsTrail lang={lang} />
        </div>
        <FilterButton dict={dict} />
      </div>
    </BreadcrumbsAnimations>
  );
};

export default Breadcrumbs;
