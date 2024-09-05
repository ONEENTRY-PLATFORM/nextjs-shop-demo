'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import SearchIcon from '@/components/icons/search';

import SearchResults from './SearchResults';

const SearchBar: React.FC = () => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace } = useRouter();
  const router = useRouter();
  const [state, setState] = useState(false);

  const searchPlaceholder = useAppSelector(
    (state) => state.systemContentReducer.content.search_placeholder,
  );

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/shop?${params.toString()}`);
    setState(false);
  };

  return (
    <div className="relative my-auto ml-24 flex h-[60px] w-fit shrink-0 grow basis-0 flex-row items-center justify-end gap-5 rounded-[30px] border border-solid border-gray-400 bg-white px-7 max-md:ml-0 max-md:h-[50px] max-md:max-w-full max-md:px-5 max-sm:hidden max-sm:h-[40px] max-sm:gap-0 max-sm:px-4 max-sm:pr-1">
      <form className="flex w-full" onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="quick-search" className="sr-only">
          {searchPlaceholder}
        </label>
        <input
          // value={searchParams.get('search')?.toString()}
          defaultValue={searchParams.get('search')?.toString()}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          type="search"
          placeholder={searchPlaceholder}
          id="quick-search"
          name="quick-search"
          className="h-auto w-full self-stretch border-none text-lg outline-none max-md:max-w-full max-md:px-5"
        />
        <button
          type="submit"
          className="group relative m-auto box-border flex shrink-0 flex-col p-2.5"
        >
          <span className="sr-only">{searchPlaceholder}</span>
          <SearchIcon />
        </button>
      </form>
      <SearchResults
        searchValue={searchParams.get('search')?.toString()}
        state={state}
        setState={setState}
      />
    </div>
  );
};

export default SearchBar;
