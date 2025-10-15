'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';

/**
 * Reset button component for clearing all filter parameters and returning to default state.
 * This component renders a button that, when clicked, removes all filter-related query
 * parameters from the URL, effectively resetting all applied filters.
 * @param   {object}           props      - Component properties
 * @param   {IAttributeValues} props.dict - Dictionary with localized values from server API
 * @returns {JSX.Element}                 ResetButton component with localized text
 */
const ResetButton = ({ dict }: { dict: IAttributeValues }): JSX.Element => {
  /** Get current path and navigation functions for URL manipulation */
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  /**
   * Handle click event to reset all filter parameters.
   * Removes all filter-related query parameters from URL to restore default view.
   * @returns {void}
   */
  const handleClick = (): void => {
    /** Create a copy of current URL search parameters to modify */
    const params = new URLSearchParams(searchParams?.toString() || '');

    /** Remove all filter parameters to reset to default state */
    params.delete('in_stock');
    params.delete('color');
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('search');

    /** Navigate to the same path with cleared filter parameters */
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    /** Reset button with styling and click handler */
    <button
      onClick={handleClick}
      className="btn btn-o btn-o-gray relative box-border flex h-12 w-full shrink-0 flex-col items-center justify-center rounded-3xl px-5 py-3 text-center text-base font-medium uppercase"
    >
      {/** Display localized reset button text or fallback to 'Reset' */}
      {dict?.filter_reset_button?.value || 'Reset'}
    </button>
  );
};

export default ResetButton;
