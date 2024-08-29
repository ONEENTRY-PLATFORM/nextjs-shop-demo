'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

// import { useDebouncedCallback } from 'use-debounce';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { setSearchValue } from '@/app/store/reducers/FilterSlice';
import SearchIcon from '@/components/icons/search';

const SearchInput: React.FC = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const dispatch = useAppDispatch();

  const searchPlaceholder = useAppSelector(
    (state) => state.systemContentReducer.content.search_placeholder,
  );

  const handleSearch = (term: string) => {
    // console.log(`Searching... ${term}`);
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <form
      className="flex w-full"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <label htmlFor="quick-search" className="sr-only">
        {searchPlaceholder}
      </label>
      <input
        // value={searchValue}
        defaultValue={searchParams.get('search')?.toString()}
        onChange={(e) => {
          dispatch(setSearchValue(e.target.value));
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
  );
};

export default SearchInput;
