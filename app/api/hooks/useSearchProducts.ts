'use client';

import type { IError } from 'oneentry/dist/base/utils';
import type {
  IProductSearchResult,
  IProductsEntity,
} from 'oneentry/dist/products/productsInterfaces';
import { useEffect, useState } from 'react';

import { getApi, isError } from '@/app/api';
import { toLangCode } from '@/app/types/enum';

/**
 * isFullProducts — narrows the `searchProduct` union to full product entities.
 *
 * `searchProduct` answers with `IProductsEntity[]` normally, but with short
 * `IProductSearchResult` cards (`{ id, title, pageId }`) once the project runs
 * with `traficLimit`. The first element decides; an empty array counts as full.
 * @param   {Array}   arr - Result array from `Products.searchProduct`.
 * @returns {boolean}     `true` when the array holds full `IProductsEntity` items.
 */
const isFullProducts = (
  arr: IProductsEntity[] | IProductSearchResult[],
): arr is IProductsEntity[] => {
  const first = arr[0];
  return first === undefined || 'attributeValues' in first;
};

/**
 * resolveSearchResult — turns a `searchProduct` answer into full product entities.
 *
 * Hydrates the short `traficLimit` cards through `getProductsByIds` so the grid
 * always receives renderable entities, and degrades to an empty list on an API
 * error instead of handing the error object to the consumers.
 * @param   {object|Array} result   - Raw answer from `Products.searchProduct`.
 * @param   {string}       langCode - SDK language code.
 * @returns {Promise}               Full product entities (empty on error).
 */
const resolveSearchResult = async (
  result: IProductsEntity[] | IProductSearchResult[] | IError,
  langCode: string,
): Promise<IProductsEntity[]> => {
  if (isError(result) || !Array.isArray(result)) {
    return [];
  }
  if (isFullProducts(result)) {
    return result;
  }
  const full = await getApi().Products.getProductsByIds(
    result.map((product) => product.id).join(','),
    langCode,
  );
  return !isError(full) && Array.isArray(full) ? full : [];
};

/**
 * Search products with Products API
 * @param   {object} props      - Search parameters
 * @param   {string} props.name - Product name
 * @param   {string} props.lang - Current language shortcode
 * @returns {object}            Array with ProductEntity objects
 * @see {@link https://doc.oneentry.cloud/docs/catalog OneEntry CMS docs}
 */
export const useSearchProducts = ({
  name,
  lang,
}: {
  name: string;
  lang: string;
}): {
  loading: boolean;
  products: IProductsEntity[];
  refetch: () => void;
} => {
  /** Convert short locale to SDK langCode */
  const langCode = toLangCode(lang);
  /** Loading state for search operation */
  const [loading, setLoading] = useState<boolean>(false);
  /** Store searched products */
  const [products, setProducts] = useState<IProductsEntity[]>([]);
  /** Refetch trigger state */
  const [refetch, setRefetch] = useState(false);

  /** search products on data change */
  useEffect(() => {
    /** Exit early if no search term provided */
    if (!name) {
      return;
    }
    /** Guards against a stale response landing after a newer search */
    let cancelled = false;
    /** Async function to search products */
    (async () => {
      /** Set loading state to true */
      setLoading(true);
      /** Search products using API */
      const result = await getApi().Products.searchProduct(name, langCode);
      /** A failure is a VALUE here, not a throw — it must be checked, never cast */
      const found = await resolveSearchResult(result, langCode);
      if (cancelled) {
        return;
      }
      /** Update products state with search results */
      setProducts(found);
      /** Set loading state to false */
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [refetch, langCode, name]);

  /** Return search results and refetch function */
  return {
    loading,
    products,
    refetch() {
      setRefetch(!refetch);
    },
  };
};
