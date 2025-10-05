import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';

import { ServerProvider } from '@/app/store/providers/ServerProvider';

import Logo from './Logo';
import NavGroup from './nav/NavGroup';
import SearchBar from './search/SearchBar';

/**
 * Header section.
 * @returns {JSX.Element} Header component.
 */
const Header = (): JSX.Element => {
  // get props from server provider
  const [lang] = ServerProvider('lang');
  const [dict] = ServerProvider('dict');

  return (
    <header className="z-50 flex items-center justify-center bg-white px-5">
      <section className="mx-auto box-border flex w-full max-w-(--breakpoint-xl) grow flex-col justify-center self-stretch bg-white py-8">
        <div className="flex w-full max-w-(--breakpoint-xl) justify-between gap-8 max-md:flex-wrap max-md:gap-6 max-sm:gap-4">
          <Logo lang={lang as string} />
          <SearchBar dict={dict as IAttributeValues} lang={lang as string} />
          <NavGroup lang={lang as string} />
        </div>
      </section>
    </header>
  );
};

export default Header;
