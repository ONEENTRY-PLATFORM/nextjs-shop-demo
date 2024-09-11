/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number(searchParams.get('page')) || 0;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  return (
    <div className="flex">
      {Array.from(Array(totalPages).keys()).map((item) => (
        <button
          key={item}
          className={
            'size-8 rounded-full ' +
            (currentPage === Number(item)
              ? 'bg-neutral-100 text-orange-500'
              : '')
          }
          onClick={() => {
            router.push(
              pathname + '?' + createQueryString('page', item.toString()),
            );
          }}
        >
          {item + 1}
        </button>
      ))}
    </div>
  );
}
