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

const IntroAnimations = dynamic(
  () => import('@/app/animations/IntroAnimations'),
  {
    ssr: false,
    loading: () => null,
  },
);

const TransitionProvider = dynamic(
  () => import('@/app/animations/TransitionProvider'),
  {
    ssr: false,
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

      {/** Lazy loading of animations and notifications */}
      <Suspense fallback={null}>
        <RegisterGSAP />
        <IntroAnimations />
        <ToastContainer position="bottom-right" autoClose={2000} />
      </Suspense>
    </>
  );
}
