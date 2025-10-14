import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';

import { ServerProvider } from '@/app/store/providers/ServerProvider';

import Logo from './Logo';
import NavGroup from './nav/NavGroup';
import SearchBar from './search/SearchBar';

/**
 * Header section component that serves as the main header for the entire application.
 * Contains the logo, search bar, and navigation elements arranged in a responsive layout.
 * @returns {JSX.Element} Header component.
 */
const Header = (): JSX.Element => {
  /**
   * Get language and dictionary data from server provider
   * These values are used by child components for localization
   */
  const [lang] = ServerProvider('lang');
  const [dict] = ServerProvider('dict');

  return (
    /**
     * Main header element with high z-index to stay above other content
     * Uses flex layout for centering and has white background
     */
    <header className="z-50 flex items-center justify-center bg-white px-5">
      {/** Header section container with maximum width constraint */}
      <section className="mx-auto box-border flex w-full max-w-(--breakpoint-xl) grow flex-col justify-center self-stretch bg-white py-8">
        {/** Main header content area with responsive layout */}
        <div className="flex w-full max-w-(--breakpoint-xl) justify-between gap-8 max-md:flex-wrap max-md:gap-6 max-sm:gap-4">
          {/** Site logo component with link to homepage */}
          <Logo lang={lang as string} />
          {/** Search bar component for product search functionality */}
          <SearchBar dict={dict as IAttributeValues} lang={lang as string} />
          {/** Navigation group containing user navigation elements */}
          <NavGroup lang={lang as string} />
        </div>
      </section>
    </header>
  );
};

export default Header;
