'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { FC, FormEvent } from 'react';
import React, { useState } from 'react';
import { useDebounce } from 'use-debounce';

import SearchIcon from '@/components/icons/search';

import SearchResults from './SearchResults';

/**
 * SearchBar
 * @param lang current language shortcode
 * @param dict dictionary from server api
 *
 * @returns JSX.Element
 */
const SearchBar: FC<{ lang: string; dict: IAttributeValues }> = ({
  lang,
  dict,
}) => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace } = useRouter();

  const { search_placeholder } = dict;

  const [state, setState] = useState(false);

  const searchValue = searchParams.get('search')?.toString();
  const [value] = useDebounce(searchValue, 300);

  const handleSearch = (term: string) => {
    if (term) {
      params.set('search', term);
      setState(true);
    } else {
      params.delete('search');
      setState(false);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    replace(`/${lang}/shop?${params.toString()}`);
    setState(false);
  };

  return (
    <div className="fade-in relative my-auto ml-6 flex h-[50px] w-fit shrink-0 grow basis-0 flex-row items-center justify-end gap-5 rounded-[30px] border border-solid border-[#A8A9B5] bg-white px-7 text-slate-800 transition-all duration-500 max-md:ml-0 max-md:h-[50px] max-md:max-w-full max-md:px-5 max-sm:hidden max-sm:h-[40px] max-sm:gap-0 max-sm:px-4 max-sm:pr-1">
      <form className="flex w-full" onSubmit={handleSubmit}>
        <label htmlFor="quick-search" className="sr-only">
          {search_placeholder.value}
        </label>
        <input
          defaultValue={value}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          type="search"
          placeholder={search_placeholder.value}
          id="quick-search"
          name="quick-search"
          className="h-auto w-full self-stretch border-none text-lg outline-none max-md:max-w-full max-md:px-5"
        />
        <button
          type="submit"
          className="group relative m-auto box-border flex shrink-0 flex-col p-2.5"
        >
          <span className="sr-only">{search_placeholder.value}</span>
          <SearchIcon />
        </button>
      </form>
      <SearchResults
        searchValue={value}
        state={state}
        setState={setState}
        lang={lang}
      />
    </div>
  );
};

export default SearchBar;
