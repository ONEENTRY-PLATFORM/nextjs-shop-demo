'use client';

import Link from 'next/link';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { Dispatch, FC, Key } from 'react';
import React from 'react';

import { useSearchProducts } from '@/app/api/hooks/useSearchProducts';
import Spinner from '@/components/shared/Spinner';

interface SearchResultsProps {
  searchValue: string | undefined;
  state: boolean;
  setState: Dispatch<React.SetStateAction<boolean>>;
  lang: string;
}

/**
 * Search results
 * @param searchValue
 * @param state
 * @param setState
 * @param lang current language shortcode
 *
 * @returns JSX.Element
 */
const SearchResults: FC<SearchResultsProps> = ({
  searchValue,
  state,
  setState,
  lang,
}) => {
  const { loading, products } = useSearchProducts({
    name: searchValue || '',
    lang: lang,
  });

  if (loading) {
    return <Spinner />;
  }

  return state ? (
    <div className="absolute left-0 top-full z-30 mt-px flex w-full flex-col gap-1 rounded-2xl bg-white p-5 shadow-lg">
      <button
        className="absolute right-3 top-3 size-4"
        onClick={() => setState(false)}
      >
        &#10005;
      </button>
      {products.length > 0
        ? products.map((product: IProductsEntity, i: Key) => {
            const { id, localizeInfos, attributeSetIdentifier } = product;

            if (attributeSetIdentifier === 'service_product') {
              return;
            }
            return (
              <div key={i} className="flex w-full">
                <Link
                  prefetch={true}
                  href={'/shop/product/' + id}
                  onClick={() => setState(false)}
                  className="flex w-full py-2 hover:text-red-500"
                >
                  {localizeInfos.title}
                </Link>
              </div>
            );
          })
        : 'Not found'}
    </div>
  ) : null;
};

export default SearchResults;
