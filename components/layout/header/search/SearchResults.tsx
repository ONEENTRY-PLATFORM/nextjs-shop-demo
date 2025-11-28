'use client';

import Link from 'next/link';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { Dispatch, JSX, Key, SetStateAction } from 'react';

import { useSearchProducts } from '@/app/api/hooks/useSearchProducts';
import Spinner from '@/components/shared/Spinner';

/**
 * Search results component for displaying product search results in a dropdown.
 * Fetches and displays products matching the search term with links to product pages.
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
  /**
   * Fetch products based on search value using custom hook
   * Provides loading state and products array for rendering
   */
  const { loading, products } = useSearchProducts({
    name: searchValue || '',
    lang: lang,
  });

  /**
   * Display spinner while loading search results
   * Provides visual feedback during product search
   */
  if (loading) {
    return <Spinner />;
  }

  /*
   * Search results dropdown container with absolute positioning
   * Appears below the search bar with shadow and rounded corners for visual distinction
   */
  return state ? (
    <div className="absolute left-0 top-full z-30 mt-px flex w-full flex-col gap-1 rounded-2xl bg-white p-5 shadow-lg">
      {/** Close button to hide search results */}
      <button
        className="absolute right-3 top-3 size-4"
        onClick={() => setState(false)}
      >
        &#10005;
      </button>
      {/** Map through products and display search results */}
      {products.length > 0
        ? products.map((product: IProductsEntity, i: Key) => {
            const { id, localizeInfos, attributeSetIdentifier } = product;

            /**
             * Skip rendering service products in search results
             * Only physical products should appear in search
             */
            if (attributeSetIdentifier === 'service_product') {
              return;
            }
            /* Container for individual product search result */
            return (
              <div key={i} className="flex w-full">
                {/** Link to product page with product title */}
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
