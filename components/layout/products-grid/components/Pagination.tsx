'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useTransitionRouter } from 'next-transition-router';
import type { JSX } from 'react';
import { useCallback } from 'react';

/**
 * Pagination component renders a set of page navigation buttons for paginated content.
 * @param   {object}      props            - Component properties
 * @param   {number}      props.totalPages - Total number of pages available for pagination
 * @returns {JSX.Element}                  A div element containing page navigation buttons
 */
const Pagination = ({ totalPages }: { totalPages: number }): JSX.Element => {
  /** Get current routing information */
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useTransitionRouter();

  /** Extract current page from URL parameters or default to 1 */
  const currentPage = Number(searchParams.get('page')) || 1;

  /**
   * Create query string with updated page parameter
   * @param   {string} name  - Parameter name
   * @param   {string} value - Parameter value
   * @returns {string}       Updated query string
   */
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  return (
    <div className="flex gap-1">
      {Array.from(Array(Math.ceil(totalPages)).keys()).map((item) => (
        <button
          key={item}
          className={
            'size-8 rounded-full border border-solid border-neutral-100 text-neutral-700 transition-colors hover:border-orange-500 hover:text-orange-500 ' +
            (currentPage === Number(item)
              ? 'border-orange-500 text-orange-500'
              : '')
          }
          onClick={() => {
            router.push(
              pathname + '?' + createQueryString('page', item.toString()),
            );
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
