'use client';

import type { JSX } from 'react';

import { blocksColors, blocksData } from '@/components/data';
import BlocksGridLoader from '@/components/layout/blocks-grid/components/BlocksGridLoader';
import CartLoader from '@/components/layout/cart/components/CartLoader';
import { CategoriesLoader } from '@/components/layout/categories/components/CategoriesLoader';
import FavoritesLoader from '@/components/layout/favorites/FavoritesLoader';
import OrdersLoader from '@/components/layout/orders/components/OrdersLoader';
import PaymentLoader from '@/components/layout/payment/components/PaymentLoader';
import ProductSingleLoader from '@/components/layout/product/components/ProductSingleLoader';
import ProductsGridLoader from '@/components/layout/products-grid/components/ProductsGridLoader';
import ProfileLoader from '@/components/layout/profile/ProfileLoader';

import { getSubSegments } from './navigationRoutes';

/**
 * Generic page skeleton used as a fallback for routes that have no
 * route-specific loader (about, contacts, payment, delivery, …).
 * @returns {JSX.Element} A neutral content skeleton.
 */
const GenericPageLoader = (): JSX.Element => (
  <div className="mx-auto flex w-full max-w-(--breakpoint-xl) flex-col gap-4">
    <div className="animate-loader h-8 w-1/3 rounded-full" />
    <div className="animate-loader h-4 w-full rounded-full" />
    <div className="animate-loader h-4 w-full rounded-full" />
    <div className="animate-loader h-4 w-5/6 rounded-full" />
    <div className="animate-loader mt-4 h-64 w-full rounded-3xl" />
  </div>
);

/**
 * RouteSkeleton picks the loader that best matches the destination route so
 * the user sees the right content shape the instant they trigger navigation,
 * before the next page has loaded.
 *
 * The skeletons render on a transparent background — the previous page's
 * content is hidden (not painted over) by the transition provider, so no solid
 * cover is needed.
 * @param   {object}        props      - Component props.
 * @param   {string | null} props.path - The pending navigation target href.
 * @returns {JSX.Element}              The matching route skeleton.
 */
const RouteSkeleton = ({ path }: { path: string | null }): JSX.Element => {
  const segments = getSubSegments(path);
  const sub = segments.join('/');

  /** Home page → blocks grid (centered like the home page). */
  if (segments.length === 0) {
    return (
      <section className="relative mx-auto box-border flex w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
        <BlocksGridLoader blocksData={blocksData} blocksColors={blocksColors} />
      </section>
    );
  }

  /** Single product page. */
  if (sub.startsWith('shop/product/')) {
    return <ProductSingleLoader />;
  }

  /** Categories overview grid (centered like the category page). */
  if (sub === 'shop/category') {
    return (
      <main className="relative mx-auto box-border flex w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
        <CategoriesLoader />
      </main>
    );
  }

  /** Catalog routes: shop, shop/[handle], shop/category/[handle]. */
  if (sub === 'shop' || sub.startsWith('shop/')) {
    return <ProductsGridLoader />;
  }

  /** Favorites — sidebar + products grid. */
  if (sub === 'favorites') {
    return <FavoritesLoader />;
  }

  /** Orders — sidebar + table (header + rows). */
  if (sub === 'orders') {
    return <OrdersLoader />;
  }

  /** Cart — sidebar + product rows + delivery/totals. */
  if (sub === 'cart') {
    return <CartLoader />;
  }

  /** Profile — sidebar + user-form skeleton. */
  if (sub === 'profile') {
    return <ProfileLoader />;
  }

  /** Payment — sidebar + payment-method cards skeleton. */
  if (sub === 'payment') {
    return <PaymentLoader />;
  }

  /** Everything else (static pages, contacts, …). */
  return <GenericPageLoader />;
};

export default RouteSkeleton;
