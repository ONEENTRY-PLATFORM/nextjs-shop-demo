'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useTransitionRouter } from 'next-transition-router';
import type { FC } from 'react';

/**
 * Pagination Item
 */
const PaginationItem: FC<{
  page: number;
  isActive: boolean;
  href: string;
}> = ({ page, isActive, href }) => {
  const router = useTransitionRouter();

  return (
    <button
      className={`size-8 rounded-full border border-solid transition-colors ${
        isActive
          ? 'border-orange-500 text-orange-500'
          : 'border-neutral-100 text-neutral-700 hover:border-orange-500 hover:text-orange-500'
      }`}
      onClick={() => router.push(href)}
    >
      {page}
    </button>
  );
};

/**
 * Pagination
 * @param totalPages
 *
 * @returns Pagination
 */
const Pagination: FC<{ totalPages: number }> = ({ totalPages }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Handle useSearchParams in a try/catch to prevent build errors
  let searchParamsString;
  try {
    searchParamsString = searchParams?.toString() || '';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // If useSearchParams fails (e.g. during SSR), create empty params
    searchParamsString = '';
  }

  const currentPage = Number(searchParams?.get('page')) || 1;

  const createQueryString = (page: number) => {
    const params = new URLSearchParams(searchParamsString);
    params.set('page', page.toString());

    return params.toString();
  };

  // Create an array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Maximum number of page buttons to show

    // Calculate start and end page numbers
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    // Adjust if we're near the end
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('ellipsis-start');
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis and last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('ellipsis-end');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="relative mx-auto mb-10 flex h-10 w-fit flex-row items-center justify-center gap-2.5 self-center rounded-3xl bg-gray-100 px-5 py-2.5 text-center">
      {pageNumbers.map((page, index) => {
        if (page === 'ellipsis-start' || page === 'ellipsis-end') {
          return (
            <span key={index} className="px-2">
              ...
            </span>
          );
        }

        return (
          <PaginationItem
            key={index}
            page={page as number}
            isActive={page === currentPage}
            href={`${pathname}?${createQueryString(page as number)}`}
          />
        );
      })}
    </div>
  );
};

export default Pagination;
