'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { usePathname, useSearchParams } from 'next/navigation';
import { useTransitionRouter } from 'next-transition-router';
import type { JSX } from 'react';
import { useLayoutEffect, useRef } from 'react';
import { useCallback } from 'react';

import Spinner from '@/components/shared/Spinner';

/**
 * LoadMore component provides infinite scrolling functionality for paginated content.
 * It automatically loads the next page when the user scrolls to the bottom of the page
 * and also provides a manual button for loading more content.
 * The component uses GSAP ScrollTrigger to detect when the user reaches the bottom
 * and automatically navigates to the next page.
 * @param   {object}      props            - Component properties
 * @param   {number}      props.totalPages - Total number of pages available for pagination
 * @returns {JSX.Element}                  A button element for manual loading or an automatic scroll-triggered loader
 */
const LoadMore = ({ totalPages }: { totalPages: number }): JSX.Element => {
  /** Get current routing information */
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useTransitionRouter();

  /** Extract current page from URL parameters or default to 1 */
  const currentPage = Number(searchParams.get('page')) || 1;
  /** Calculate next page number */
  const nextPage = (currentPage < 1 ? 1 : currentPage) + 1;

  /** Reference to the DOM element for scroll triggering */
  const ref = useRef(null);

  /**
   * Create query string with updated page parameter while preserving all other params
   * Reads current URL params directly from window.location to ensure freshness
   * @param   {string} name  - Parameter name
   * @param   {string} value - Parameter value
   * @returns {string}       Updated query string
   */
  const createQueryString = useCallback(
    (name: string, value: string) => {
      /** Read current URL params directly from window.location to get the most recent state */
      const currentParams = new URLSearchParams(window.location.search);
      /** Set the new page parameter */
      currentParams.set(name, value);

      return currentParams.toString();
    },
    [],
  );

  /** Register GSAP plugins on component mount */
  useLayoutEffect(() => {
    gsap.registerPlugin(useGSAP, ScrollTrigger);
  }, []);

  /**
   * Navigate to the next page by updating the URL
   * Ensures we don't go beyond the total number of pages
   */
  const goToNextPage = useCallback(() => {
    const queryString = createQueryString(
      'page',
      (nextPage <= totalPages ? nextPage : currentPage).toString(),
    );
    const fullUrl = pathname + '?' + queryString;

    /** Navigate without scrolling to top */
    router.push(fullUrl, { scroll: false });
  }, [pathname, createQueryString, nextPage, totalPages, currentPage, router]);

  /** Set up scroll trigger to automatically load next page when reaching bottom */
  useGSAP(() => {
    /** Don't set up trigger if we're already on the last page */
    if (nextPage > totalPages) {
      return;
    }

    /** Create scroll trigger that activates when component enters viewport */
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top bottom',
      end: 'bottom bottom',
      onEnter: () => {
        goToNextPage();
      },
    });

    /** Cleanup function to kill trigger on component unmount */
    return () => {
      trigger.kill();
    };
  }, [currentPage, goToNextPage, nextPage, totalPages]);

  return (
    <button
      onClick={() => {
        goToNextPage();
      }}
      ref={ref}
      className="relative mx-auto flex h-6 w-20"
    >
      {/* {currentPage !== totalPages && 'Load more'} */}
      {currentPage < totalPages && <Spinner />}
    </button>
  );
};

export default LoadMore;
