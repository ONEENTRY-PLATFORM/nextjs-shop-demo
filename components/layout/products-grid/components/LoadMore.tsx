'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { FC, RefObject } from 'react';
import { useEffect, useRef } from 'react';
import { useCallback } from 'react';

import Spinner from '@/components/shared/Spinner';

/**
 * LoadMore
 * @param totalPages - Total number of pages available
 *
 * @returns LoadMore button that triggers infinite scroll or pagination
 */
const LoadMore: FC<{ totalPages: number }> = ({ totalPages }) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const ref = useRef<HTMLButtonElement | null>(null);

  // Parse current page safely
  const currentPage = (() => {
    try {
      const page = searchParams?.get('page');
      return page ? Math.max(1, Number(page)) : 1;
    } catch {
      return 1;
    }
  })();

  const nextPage = currentPage + 1;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString() || '');
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  // Register GSAP plugins once
  useEffect(() => {
    gsap.registerPlugin(useGSAP);
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  const goToNextPage = useCallback(() => {
    if (nextPage > totalPages) return;

    router.push(
      `${pathname}?${createQueryString('page', nextPage.toString())}`,
      { scroll: false },
    );
  }, [nextPage, totalPages, pathname, createQueryString, router]);

  useGSAP(
    () => {
      if (nextPage > totalPages || !ref.current) return;

      const trigger = ScrollTrigger.create({
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom bottom',
        onEnter: goToNextPage,
        once: true, // Prevent multiple firings
      });

      return () => {
        trigger.kill();
      };
    },
    {
      dependencies: [nextPage, totalPages],
      scope: ref,
    },
  );

  return (
    <button
      onClick={goToNextPage}
      ref={ref as RefObject<HTMLButtonElement>}
      className="relative mx-auto flex h-6 w-20 cursor-pointer"
      disabled={nextPage > totalPages}
      aria-label={
        nextPage > totalPages ? 'No more pages to load' : 'Load more items'
      }
    >
      {nextPage <= totalPages && <Spinner />}
    </button>
  );
};

export default LoadMore;
