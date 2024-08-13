// import { usePathname, useSearchParams } from 'next/navigation';

import BackButton from './BackButton';
import BreadcrumbsTrail from './BreadcrumbsTrail';

const Breadcrumbs: React.FC = () => {
  return (
    <section
      className="
        mx-auto box-border flex w-full 
        grow flex-col 
        justify-center self-stretch border 
        border-solid 
        border-neutral-100 
        bg-white px-5 py-2
      "
    >
      <div
        className="
        mx-auto flex w-full 
        max-w-screen-xl flex-col justify-center 
      "
      >
        <div className="mr-auto flex gap-5">
          <BackButton />
          <BreadcrumbsTrail />
        </div>
      </div>
    </section>
  );
};

export default Breadcrumbs;
