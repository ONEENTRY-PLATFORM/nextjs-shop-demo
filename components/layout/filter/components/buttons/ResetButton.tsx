'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';

/**
 * Reset button component for clearing all filter parameters
 * @param   {object}           props      - component props
 * @param   {IAttributeValues} props.dict - dictionary with localized values from server API
 * @returns {JSX.Element}                 ResetButton component
 */
const ResetButton = ({ dict }: { dict: IAttributeValues }): JSX.Element => {
  // Get current path and navigation functions
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  /**
   * Handle click event to reset all filter parameters
   * Removes all filter-related query parameters from URL
   */
  const handleClick = () => {
    // Create a copy of current URL search parameters
    const params = new URLSearchParams(searchParams?.toString() || '');

    // Remove all filter parameters
    params.delete('in_stock');
    params.delete('color');
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('search');

    // Navigate to the same path with cleared parameters
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <button
      onClick={handleClick}
      className="btn btn-o btn-o-gray relative box-border flex h-12 w-full shrink-0 flex-col items-center justify-center rounded-3xl px-5 py-3 text-center text-base font-medium uppercase"
    >
      {dict?.filter_reset_button?.value || 'Reset'}
    </button>
  );
};

export default ResetButton;
