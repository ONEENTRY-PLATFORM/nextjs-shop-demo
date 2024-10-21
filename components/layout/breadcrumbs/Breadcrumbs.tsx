import type { FC } from 'react';

import { useServerProvider } from '@/app/store/providers/ServerProvider';

import BreadcrumbsTrail from './BreadcrumbsTrail';
import BackButton from './components/BackButton';
import BreadcrumbsAnimations from './components/BreadcrumbsAnimations';
import FilterButton from './components/FilterButton';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Breadcrumbs: FC = () => {
  const [lang] = useServerProvider('lang');
  const [dict] = useServerProvider('dict');

  return (
    <BreadcrumbsAnimations className="mx-auto box-border flex w-full grow flex-col justify-center self-stretch bg-white px-4 py-2">
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
