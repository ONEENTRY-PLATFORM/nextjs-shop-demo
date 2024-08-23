'use client';

import Image from 'next/image';
import React from 'react';

import { useAppDispatch } from '@/app/store/hooks';
import { setSearchValue } from '@/app/store/reducers/FilterSlice';
import SearchIcon from '@/components/icons/search';

const SearchBar: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <form className="my-auto ml-24 flex h-[60px] w-fit shrink-0 grow basis-0 flex-row items-center justify-end gap-5 rounded-[30px] border border-solid border-gray-400 bg-white px-7 max-md:max-w-full max-md:px-5">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        onChange={(e) => dispatch(setSearchValue(e.target.value))}
        type="search"
        id="search"
        placeholder="Search"
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
    </form>
  );
};

export default SearchBar;
