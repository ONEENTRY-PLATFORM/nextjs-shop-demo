'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useTransitionRouter } from 'next-transition-router';
import type { FC } from 'react';

interface PaginationItemProps {
  page: number;
  isActive: boolean;
  href: string;
}

/**
 * Pagination Item component that represents a single page button
 * 
 * This component renders a button for a specific page number in the pagination controls.
 * It handles the visual styling for active vs inactive pages and navigation to the selected page.
 * 
 * @param page - The page number to display on this button
 * @param isActive - Whether this page is currently active/selected
 * @param href - The URL to navigate to when this button is clicked
 */
const PaginationItem: FC<PaginationItemProps> = ({ page, isActive, href }) => {
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

interface PaginationProps {
  totalPages: number;
}

/**
 * Pagination component that displays page navigation controls
 * 
 * This component renders a pagination control with smart page numbering that
 * adapts based on the current page and total number of pages. It shows a
 * fixed number of page buttons and adds ellipses when there are many pages.
 * 
 * @param totalPages - Total number of pages available
 * @returns Pagination component with navigation buttons
 */
const Pagination: FC<PaginationProps> = ({ totalPages }) => {
  const pathname = usePathname();

  // Handle useSearchParams in a try/catch to prevent build errors
  let searchParamsString = '';
  let currentPage = 1;

  try {
    const searchParams = useSearchParams();
    searchParamsString = searchParams?.toString() || '';
    currentPage = Number(searchParams?.get('page')) || 1;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // If useSearchParams fails (e.g. during SSR), create empty params
    searchParamsString = '';
    currentPage = 1;
  }

  /**
   * Creates a query string for a specific page number
   * 
   * @param page - The page number to include in the query string
   * @returns The query string with the page parameter set
   */
  const createQueryString = (page: number) => {
    const params = new URLSearchParams(searchParamsString);
    params.set('page', page.toString());

    return params.toString();
  };

  /**
   * Generates an array of page numbers to display in the pagination controls
   * 
   * This function implements smart pagination that shows a fixed number of
   * page buttons and adds ellipses when there are many pages. It keeps the
   * current page centered when possible.
   * 
   * @returns Array of page numbers and ellipsis markers to display
   */
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

  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  // Don't render if we don't have a pathname
  if (!pathname) {
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