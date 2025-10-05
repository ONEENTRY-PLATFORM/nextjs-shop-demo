'use client';

import Link from 'next/link';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { Dispatch, JSX, Key, SetStateAction } from 'react';
import React from 'react';

import { useSearchProducts } from '@/app/api/hooks/useSearchProducts';
import Spinner from '@/components/shared/Spinner';

/**
 * Search results.
 * @param   {object}             props             - SearchResultsProps.
 * @param   {string | undefined} props.searchValue - search value.
 * @param   {unknown}            props.state       - state.
 * @param   {Dispatch<unknown>}  props.setState    - set state.
 * @param   {string}             props.lang        - current language shortcode.
 * @returns {JSX.Element}                          JSX.Element.
 */
const SearchResults = ({
  searchValue,
  state,
  setState,
  lang,
}: {
  searchValue: string | undefined;
  state: boolean;
  setState: Dispatch<SetStateAction<boolean>>;
  lang: string;
}): JSX.Element => {
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
  ) : (
    <></>
  );
};

export default SearchResults;
