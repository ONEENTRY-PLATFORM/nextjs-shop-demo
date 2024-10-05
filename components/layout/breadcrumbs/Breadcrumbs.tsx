import type { FC } from 'react';

import BreadcrumbsTrail from './BreadcrumbsTrail';
import BackButton from './components/BackButton';
import FilterButton from './components/FilterButton';

const Breadcrumbs: FC<{ lang: string; withFilter: boolean }> = async ({
  lang,
  withFilter,
}) => {
  return (
    <section className="mx-auto box-border flex w-full grow flex-col justify-center self-stretch bg-white px-4 py-2">
      <div className="mx-auto flex w-full max-w-screen-xl flex-row justify-between gap-5">
        <div className="mr-auto flex gap-5">
          <BackButton />
          <BreadcrumbsTrail lang={lang} />
        </div>
        {withFilter && <FilterButton />}
      </div>
    </section>
  );
};

export default Breadcrumbs;
