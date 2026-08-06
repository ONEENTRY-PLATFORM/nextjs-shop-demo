'use client';

import dynamic from 'next/dynamic';
import type { JSX, ReactNode } from 'react';
import { Suspense } from 'react';

/**
 * Lazy loading of heavy client components.
 */
const ToastContainer = dynamic(
  () => import('react-toastify').then((mod) => mod.ToastContainer),
  {
    ssr: false,
    loading: () => null,
  },
);

const RegisterGSAP = dynamic(
  () =>
    import('@/app/animations/RegisterGSAP').then((mod) => {
      const RegisterGSAPWrapper = () => {
        mod.default();
        return null;
      };
      return Promise.resolve(RegisterGSAPWrapper);
    }),
  {
    ssr: false,
    loading: () => null,
  },
);

/**
 * Page-transition provider. Loaded as its own chunk, but **must stay
 * server-rendered**: it wraps `children`, and `ssr: false` on a component that
 * wraps page content bails the whole Suspense boundary out to client-side
 * rendering (`BAILOUT_TO_CLIENT_SIDE_RENDERING`). The document then ships with
 * an empty `<main>` — no content to paint, no `<link rel=preload>` for the LCP
 * image — so the page stays visually blank until the JS bundle has downloaded,
 * hydrated and re-rendered the tree on the client.
 */
const TransitionProvider = dynamic(
  () => import('@/app/animations/TransitionProvider'),
  {
    loading: () => null,
  },
);

/**
 * ClientProviders component that wraps the application with client-side providers.
 *
 * This component serves as a wrapper for all client-side functionality in the application.
 * It uses dynamic imports with lazy loading to optimize performance by only loading.
 * heavy client components when needed. The component handles:
 * - Toast notifications.
 * - GSAP animation registration.
 * - Intro animations.
 * - Page transition animations.
 *
 * All client-side effects and animations are managed here to separate them from
 * server-side rendering concerns.
 * @param   {object}      props          - Component properties.
 * @param   {ReactNode}   props.children - Child components to be wrapped.
 * @returns {JSX.Element}                JSX element with all client-side providers and components.
 */
export default function ClientProviders({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <>
      <div className="grow p-5 pb-16 transition-transform duration-500">
        <Suspense fallback={<div className="min-h-screen" />}>
          <TransitionProvider>{children}</TransitionProvider>
        </Suspense>
      </div>

      {/*
        Lazy loading of animations and notifications. The intro overlay that
        used to live here was removed: being `ssr: false`, it arrived *after*
        the first paint and covered the already-rendered page with a white
        screen, then revealed `.fade-in` elements through a GSAP timeline. The
        entrance fade is a CSS animation now (see `.fade-in` in globals.css).
      */}
      <Suspense fallback={null}>
        <RegisterGSAP />
        <ToastContainer position="bottom-right" autoClose={2000} />
      </Suspense>
    </>
  );
}
