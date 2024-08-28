'use client';

import Link from 'next/link';
import React, { useEffect } from 'react';

import { useSearchProducts } from '@/app/api/hooks/useSearchProducts';
import { useAppSelector } from '@/app/store/hooks';

import SearchInput from './SearchInput';

const SearchBar: React.FC = () => {
  const searchValue = useAppSelector((state) => state.filterReducer.search);

  const data = useSearchProducts({
    name: searchValue || '',
  });

  const { products } = data;

  return (
    <div className="relative my-auto ml-24 flex h-[60px] w-fit shrink-0 grow basis-0 flex-row items-center justify-end gap-5 rounded-[30px] border border-solid border-gray-400 bg-white px-7 max-md:ml-0 max-md:h-[50px] max-md:max-w-full max-md:px-5 max-sm:h-[40px] max-sm:gap-0 max-sm:px-4 max-sm:pr-1">
      <SearchInput />
      {products.length > 0 ? (
        <div className="absolute left-0 top-full z-30 flex min-h-36 w-full flex-col rounded-lg bg-white p-5">
          {products.map((product, i) => {
            const { id, localizeInfos } = product;
            return (
              <div key={i} className="flex w-full">
                <Link href={'/product/' + id}>{localizeInfos.title}</Link>
              </div>
            );
          })}
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default SearchBar;
