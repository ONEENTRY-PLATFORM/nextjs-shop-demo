'use client';

import React, { useEffect, useState } from 'react';

import { useSearchProducts } from '@/app/api/hooks/useSearchProducts';
import { useAppSelector } from '@/app/store/hooks';

import SearchInput from './SearchInput';
import SearchResults from './SearchResults';

const SearchBar: React.FC = () => {
  const searchValue = useAppSelector((state) => state.filterReducer.search);
  const [state, setState] = useState(false);

  const data = useSearchProducts({
    name: searchValue || '',
  });

  useEffect(() => {
    if (searchValue && searchValue.length > 2) {
      setState(true);
    }
  }, [searchValue]);

  const { products } = data;

  return (
    <div className="relative my-auto ml-24 flex h-[60px] w-fit shrink-0 grow basis-0 flex-row items-center justify-end gap-5 rounded-[30px] border border-solid border-gray-400 bg-white px-7 max-md:ml-0 max-md:h-[50px] max-md:max-w-full max-md:px-5 max-sm:h-[40px] max-sm:gap-0 max-sm:px-4 max-sm:pr-1">
      <SearchInput />
      <SearchResults products={products} state={state} setState={setState} />
    </div>
  );
};

export default SearchBar;
