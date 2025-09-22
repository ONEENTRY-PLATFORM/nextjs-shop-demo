'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { FC, RefObject } from 'react';
import { useLayoutEffect, useRef } from 'react';
import { useCallback } from 'react';

import Spinner from '@/components/shared/Spinner';

/**
 * LoadMore component that implements infinite scroll functionality
 *
 * This component automatically loads the next page of products when the user scrolls
 * to the bottom of the page. It uses GSAP ScrollTrigger to detect when the load more
 * button enters the viewport and triggers the next page load.
 *
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

  /**
   * Creates a query string with the specified parameter
   *
   * @param name - The name of the query parameter
   * @param value - The value of the query parameter
   * @returns The updated query string
   */
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString() || '');
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  // Register GSAP plugins once
  useLayoutEffect(() => {
    gsap.registerPlugin(useGSAP);
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  /**
   * Navigates to the next page by updating the URL
   *
   * This function checks if there are more pages to load and if so,
   * updates the URL to reflect the next page, which triggers a data reload
   */
  const goToNextPage = useCallback(() => {
    if (nextPage > totalPages) return;

    // Save current scroll position
    const scrollPosition = typeof window !== 'undefined' ? window.scrollY : 0;

    router.push(
      `${pathname}?${createQueryString('page', nextPage.toString())}`,
      { scroll: false },
    );

    // Restore scroll position after navigation in production
    // This is needed because scroll: false doesn't work properly in production
    if (typeof window !== 'undefined') {
      // Use setTimeout to ensure navigation has completed
      setTimeout(() => {
        window.scrollTo(0, scrollPosition);
      }, 0);
    }
  }, [nextPage, totalPages, pathname, createQueryString, router]);

  /**
   * Sets up the ScrollTrigger to detect when the component enters the viewport
   *
   * When the load more button enters the viewport, this trigger will automatically
   * call the goToNextPage function to load the next page of products
   */
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
