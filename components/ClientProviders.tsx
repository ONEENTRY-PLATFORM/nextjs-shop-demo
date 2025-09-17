'use client';

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { Suspense } from 'react';

// Ленивая загрузка тяжёлых клиентских компонентов
const ToastContainer = dynamic(
  () => import('react-toastify').then((mod) => mod.ToastContainer),
  {
    ssr: false,
    loading: () => null,
  },
);

const RegisterGSAP = dynamic(() => import('@/app/animations/RegisterGSAP'), {
  ssr: false,
  loading: () => null,
});

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

interface ClientProvidersProps {
  children: ReactNode;
}

/**
 * Client-side providers with lazy loading
 * Only client-side effects/animations and notifications live here
 */
export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <>
      <div className="grow p-5 pb-16 transition-transform duration-500">
        <Suspense fallback={<div className="min-h-screen" />}>
          <TransitionProvider>{children}</TransitionProvider>
        </Suspense>
      </div>

      {/* Ленивая загрузка анимаций и уведомлений */}
      <Suspense fallback={null}>
        <RegisterGSAP />
        <IntroAnimations />
        <ToastContainer position="bottom-right" autoClose={2000} />
      </Suspense>
    </>
  );
}
