'use client';

import type { IAttributeValues, IProductsEntity } from 'oneentry/types';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';

import { getSimilarProductsByBlock } from '@/app/api/server/blocks/getSimilarProductsByBlock';
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';
import Spinner from '@/components/shared/Spinner';

import CardsGridAnimations from '../products-grid/animations/CardsGridAnimations';
import ProductCard from '../products-grid/components/product-card/ProductCard';

/** Start loading the next portion ~200px before the sentinel enters the viewport */
const OBSERVER_OPTIONS: IntersectionObserverInit = {
  root: null,
  rootMargin: '200px',
  threshold: 0,
};

/**
 * RelatedItemsGrid renders the similar products grid with infinite scroll.
 * It is seeded with the server-rendered first portion and loads the next
 * portion of `pageSize` products whenever the sentinel below the grid
 * approaches the viewport.
 *
 * Pagination math uses raw API offsets/total: the API may count the current
 * product (it is excluded from the rendered items), so pages are deduplicated
 * by product id and the offset always advances by `pageSize`.
 * @param   {object}            props              - Component properties
 * @param   {string}            props.lang         - Current language shortcode for localization
 * @param   {IAttributeValues}  props.dict         - Dictionary of attribute values from server API
 * @param   {string}            props.blockMarker  - Marker of the similar_products_block to paginate
 * @param   {number}            props.productId    - Current product id — block rules context, excluded from results
 * @param   {number}            props.pageSize     - Portion size (the block's quantity from admin)
 * @param   {IProductsEntity[]} props.initialItems - Server-rendered first portion of products
 * @param   {number}            props.total        - Raw API total of similar products across all pages
 * @returns {JSX.Element}                          A products grid that appends new portions on scroll
 */
const RelatedItemsGrid = ({
  lang,
  dict,
  blockMarker,
  productId,
  pageSize,
  initialItems,
  total,
}: {
  lang: string;
  dict: IAttributeValues;
  blockMarker: string;
  productId: number;
  pageSize: number;
  initialItems: IProductsEntity[];
  total: number;
}): JSX.Element => {
  /** Accumulated products (server-rendered portion + loaded portions) */
  const [items, setItems] = useState<IProductsEntity[]>(initialItems);
  /** Raw API offset already consumed (counted before excluding the current product) */
  const [offset, setOffset] = useState<number>(pageSize);
  /** Raw API total — refreshed from every loaded page */
  const [totalCount, setTotalCount] = useState<number>(total);
  /** Loading state of the next portion */
  const [loading, setLoading] = useState<boolean>(false);

  /** Sentinel below the grid triggering the next portion load */
  const { ref, isIntersecting } = useIntersectionObserver(OBSERVER_OPTIONS);

  const hasMore = offset < totalCount;

  /** Load the next portion when the sentinel is in view and more products exist */
  useEffect(() => {
    if (!isIntersecting || !hasMore || loading) {
      return;
    }

    /** Async function to load and append the next portion (deduplicated by id) */
    (async () => {
      setLoading(true);

      const result = await getSimilarProductsByBlock(
        blockMarker,
        lang,
        productId,
        pageSize,
        offset,
      );

      if (result.isError || !result.products) {
        /** Stop pagination on error — the visible sentinel would retrigger endlessly */
        setTotalCount(0);
        setLoading(false);
        return;
      }

      const products = result.products;
      setItems((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...products.filter((p) => !seen.has(p.id))];
      });
      setOffset((prev) => prev + pageSize);
      setTotalCount(result.total);
      setLoading(false);
    })();
  }, [
    isIntersecting,
    hasMore,
    loading,
    blockMarker,
    lang,
    productId,
    pageSize,
    offset,
  ]);

  return (
    <>
      {/* Products cards grid with animation */}
      <CardsGridAnimations className="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 max-md:w-full">
        {items.map((product: IProductsEntity, i: number) => {
          return (
            <ProductCard
              key={product.id}
              lang={lang}
              product={product}
              dict={dict}
              /* Stagger entrance within a portion, not across all loaded items */
              index={i % pageSize}
              pagesLimit={0}
            />
          );
        })}
      </CardsGridAnimations>
      {/* Sentinel: triggers the next portion while more products exist */}
      {hasMore && (
        <div ref={ref} className="relative mx-auto mt-5 flex h-6 w-20">
          {loading && <Spinner />}
        </div>
      )}
    </>
  );
};

export default RelatedItemsGrid;
