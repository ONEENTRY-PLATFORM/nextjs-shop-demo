'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useTransitionRouter } from 'next-transition-router';
import type { JSX } from 'react';
import { useCallback } from 'react';

/**
 * Pagination
 * @param   {object}      props            - Pagination props.
 * @param   {number}      props.totalPages - Total pages.
 * @returns {JSX.Element}                  Pagination
 */
const Pagination = ({ totalPages }: { totalPages: number }): JSX.Element => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useTransitionRouter();
  const currentPage = Number(searchParams.get('page')) || 1;

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
            'size-8 rounded-full border border-neutral-100 border-solid hover:text-orange-500 hover:border-orange-500 text-neutral-700 transition-colors ' +
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
