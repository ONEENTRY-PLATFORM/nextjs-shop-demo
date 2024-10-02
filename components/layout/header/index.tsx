import type { FC } from 'react';
import { Suspense } from 'react';

import { useServerProvider } from '@/app/store/providers/ServerProvider';
import { NavMenuLoader, SearchBarLoader } from '@/components/shared/Loader';

import Logo from './Logo';
import NavGroup from './nav/NavGroup';
import SearchBar from './search/SearchBar';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Header: FC<{ lang: string }> = async ({ lang }) => {
  const [dict] = useServerProvider('dict');
  return (
    <header className="flex items-center justify-center bg-white px-5">
      <section className="mx-auto box-border flex w-full max-w-screen-xl grow flex-col justify-center self-stretch bg-white md:py-6 lg:py-10">
        <div className="flex w-full max-w-screen-xl justify-between gap-16 max-md:flex-wrap max-md:gap-6 max-sm:gap-4">
          <Logo />
          <Suspense fallback={<SearchBarLoader />}>
            <SearchBar dict={dict} />
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
