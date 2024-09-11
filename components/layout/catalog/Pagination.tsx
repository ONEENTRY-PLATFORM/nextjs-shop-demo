/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

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
    <div className="flex gap-1">
      {Array.from(Array(Math.round(totalPages)).keys()).map((item) => (
        <button
          key={item}
          className={
            'size-8 rounded-full border border-neutral-100 border-solid hover:text-orange-500 hover:border-orange-500 transition-colors ' +
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
          {item + 1}
        </button>
      ))}
    </div>
  );
}
