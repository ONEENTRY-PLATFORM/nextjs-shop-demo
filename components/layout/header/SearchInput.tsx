'use client';

import React from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { setSearchValue } from '@/app/store/reducers/FilterSlice';
import SearchIcon from '@/components/icons/search';

const SearchInput: React.FC = () => {
  const dispatch = useAppDispatch();

  const searchPlaceholder = useAppSelector(
    (state) => state.systemContentReducer.content.search_placeholder,
  );
  const searchValue = useAppSelector((state) => state.filterReducer.search);

  return (
    <>
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        value={searchValue}
        onChange={(e) => dispatch(setSearchValue(e.target.value))}
        type="search"
        placeholder={searchPlaceholder}
        id="search"
        name="search"
        className="h-auto w-full self-stretch border-none text-lg outline-none max-md:max-w-full max-md:px-5"
      />
      <button
        type="submit"
        className="group relative m-auto box-border flex shrink-0 flex-col p-2.5"
      >
        <span className="sr-only">search</span>
        <SearchIcon />
      </button>
    </>
  );
};

export default SearchInput;
