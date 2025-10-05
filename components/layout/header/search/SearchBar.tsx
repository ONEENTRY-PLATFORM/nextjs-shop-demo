'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { FormEvent, JSX } from 'react';
import React, { useState } from 'react';
import { useDebounce } from 'use-debounce';

import SearchIcon from '@/components/icons/search';

import SearchResults from './SearchResults';

/**
 * SearchBar component.
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
  // Handle useSearchParams in a try/catch to prevent build errors
  let params: URLSearchParams;
  let searchParamsValue: string | null = null;

  try {
    const searchParams = useSearchParams();
    params = new URLSearchParams(searchParams?.toString() || '');
    searchParamsValue = searchParams?.get('search')?.toString() || null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // If creating URLSearchParams fails, create empty params
    params = new URLSearchParams();
    searchParamsValue = null;
  }

  const pathname = usePathname();
  const { replace } = useRouter();

  const [state, setState] = useState(false);

  const [value] = useDebounce(searchParamsValue, 300);

  const handleSearch = (term: string) => {
    if (term) {
      params.set('search', term);
      setState(true);
    } else {
      params.delete('search');
      setState(false);
    }

    // Only update URL if we have pathname
    if (pathname) {
      replace(`${pathname}?${params.toString()}`);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Only update URL if we have pathname
    if (pathname) {
      replace(`/${lang}/shop?${params.toString()}`);
    }
    setState(false);
  };

  return (
    <div className="fade-in relative my-auto ml-9 flex h-[50px] w-fit shrink-0 grow basis-0 flex-row items-center justify-end gap-5 rounded-[30px] border border-solid border-[#A8A9B5] bg-white text-slate-800 transition-all duration-500 max-md:ml-0 max-md:h-[50px] max-md:max-w-full max-md:px-0 max-sm:hidden max-sm:h-[40px] max-sm:gap-0 max-sm:px-4 max-sm:pr-1">
      <form className="flex w-full" onSubmit={handleSubmit}>
        <label htmlFor="quick-search" className="sr-only">
          {dict?.search_placeholder?.value}
        </label>
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
        <button
          type="submit"
          className="group cursor-pointer relative m-auto box-border flex shrink-0 flex-col p-2.5"
        >
          <span className="sr-only">{dict?.search_placeholder?.value}</span>
          <SearchIcon />
        </button>
      </form>
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
