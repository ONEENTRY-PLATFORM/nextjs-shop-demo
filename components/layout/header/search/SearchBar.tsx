/* eslint-disable jsdoc/reject-any-type */
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { FormEvent, JSX } from 'react';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';

import SearchIcon from '@/components/icons/search';

import SearchResults from './SearchResults';

/**
 * SearchBar component for searching products across the site.
 * Provides a search input field with real-time search functionality and search results dropdown.
 * @param   {object}           props      - Component properties.
 * @param   {string}           props.lang - current language shortcode.
 * @param   {IAttributeValues} props.dict - dictionary from server api.
 * @returns {JSX.Element}                 JSX.Element.
 */
const SearchBar = ({
  lang,
  dict,
}: {
  lang: string;
  dict: IAttributeValues;
}): JSX.Element => {
  /**
   * Handle useSearchParams in a try/catch to prevent build errors
   * This is needed because useSearchParams may not be available during static generation
   */
  let params: URLSearchParams;
  let searchParamsValue: string | null = null;

  try {
    const searchParams = useSearchParams();
    params = new URLSearchParams(searchParams?.toString() || '');
    searchParamsValue = searchParams?.get('search')?.toString() || null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    /**
     * If creating URLSearchParams fails, create empty params
     * This fallback ensures the component works even when search params are not available
     */
    params = new URLSearchParams();
    searchParamsValue = null;
  }

  /**
   * Get current pathname and router replace function from Next.js
   * Used for updating the URL with search parameters
   */
  const pathname = usePathname();
  const { replace } = useRouter();

  /**
   * State to control the visibility of search results dropdown
   * When true, the search results are shown; when false, they are hidden
   */
  const [state, setState] = useState(false);

  /**
   * Debounced search value to prevent excessive API calls
   * Delays the search execution by 300ms after the user stops typing
   */
  const [value] = useDebounce(searchParamsValue, 300);

  /**
   * Handle search input changes
   * Updates URL parameters and controls search results visibility
   * @param {string} term - The search term entered by the user
   */
  const handleSearch = (term: string) => {
    if (term) {
      params.set('search', term);
      setState(true);
    } else {
      params.delete('search');
      setState(false);
    }

    /**
     * Only update URL if we have pathname
     * Prevents errors when pathname is not yet available
     */
    if (pathname) {
      replace(`${pathname}?${params.toString()}`);
    }
  };

  /**
   * Handle form submission
   * Redirects to the shop page with search parameters
   * @param {FormEvent<HTMLFormElement>} e - The form submission event
   */
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    /**
     * Only update URL if we have pathname
     * Prevents errors when pathname is not yet available
     */
    if (pathname) {
      replace(`/${lang}/shop?${params.toString()}`);
    }
    setState(false);
  };

  /**
   * Search bar container with fade-in animation and responsive styling
   * Includes rounded borders, transition effects, and responsive design for different screen sizes
   * @param {any} e - Event object
   */
  return (
    <div className="fade-in relative my-auto ml-9 flex h-[50px] w-fit shrink-0 grow basis-0 flex-row items-center justify-end gap-5 rounded-[30px] border border-solid border-[#A8A9B5] bg-white text-slate-800 transition-all duration-500 max-md:ml-0 max-md:h-[50px] max-md:max-w-full max-md:px-0 max-sm:hidden max-sm:h-[40px] max-sm:gap-0 max-sm:px-4 max-sm:pr-1">
      {/** Search form containing input field and submit button */}
      <form className="flex w-full" onSubmit={handleSubmit}>
        {/** Hidden label for accessibility. Provides context for screen readers about the search input */}
        <label htmlFor="quick-search" className="sr-only">
          {dict?.search_placeholder?.value}
        </label>
        {/** Search input field with real-time search functionality */}
        <input
          defaultValue={value || ''}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          type="search"
          placeholder={dict?.search_placeholder?.value as string}
          id="quick-search"
          name="quick-search"
          className="h-auto w-full self-stretch rounded-3xl border-none px-5 text-lg outline-none max-md:max-w-full max-md:px-3"
        />
        {/** Search submit button with icon. Triggers form submission to navigate to the shop page with search results */}
        <button
          type="submit"
          className="group cursor-pointer relative m-auto box-border flex shrink-0 flex-col p-2.5"
        >
          {/** Hidden text for accessibility. Provides context for screen readers about the search button */}
          <span className="sr-only">{dict?.search_placeholder?.value}</span>
          <SearchIcon />
        </button>
      </form>
      {/** Search results dropdown component. Displays search results based on the current search value*/}
      <SearchResults
        searchValue={value || undefined}
        state={state}
        setState={setState}
        lang={lang}
      />
    </div>
  );
};

export default SearchBar;
