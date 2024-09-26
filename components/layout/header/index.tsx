import type { FC } from 'react';
import { Suspense } from 'react';

import { NavMenuLoader, SearchBarLoader } from '@/components/shared/Loader';

import Logo from './Logo';
import NavGroup from './nav/NavGroup';
import SearchBar from './search/SearchBar';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Header: FC<{ params: any }> = async ({ params }) => {
  console.log(params);
  return (
    <header className="flex items-center justify-center bg-white px-5">
      <section className="mx-auto box-border flex w-full max-w-screen-xl grow flex-col justify-center self-stretch bg-white md:py-6 lg:py-10">
        <div className="flex w-full max-w-screen-xl justify-between gap-16 max-md:flex-wrap max-md:gap-6">
          <Logo params={params} />
          <Suspense fallback={<SearchBarLoader />}>
            <SearchBar />
          </Suspense>
          <Suspense fallback={<NavMenuLoader />}>
            <NavGroup />
          </Suspense>
        </div>
      </section>
    </header>
  );
};

export default Header;
