'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Reset button component for clearing all filter parameters and returning to default state.
 * This component renders a button that, when clicked, removes all filter-related query
 * parameters from the URL and closes the filter modal, effectively resetting all applied filters.
 * @param   {object}           props      - Component properties
 * @param   {IAttributeValues} props.dict - Dictionary with localized values from server API
 * @returns {JSX.Element}                 ResetButton component with localized text
 */
const ResetButton = ({ dict }: { dict: IAttributeValues }): JSX.Element => {
  /** Get the transition setter from the OpenDrawerContext to control modal state */
  const { setTransition } = useContext(OpenDrawerContext);
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

    /**
     * Close the filter modal (same flow as Apply). The form unmounts on close,
     * so the filter inputs re-seed from the cleared URL on the next open —
     * otherwise their local state would keep the old values and an Apply right
     * after Reset would re-apply the just-cleared filter.
     */
    setTransition('close');
  };

  return (
    /** Reset button with styling and click handler */
    <button
      onClick={handleClick}
      data-testid="filter-reset-button"
      className="btn btn-o btn-o-gray relative box-border flex h-12 w-full shrink-0 flex-col items-center justify-center rounded-3xl px-5 py-3 text-center text-base font-medium uppercase"
    >
      {/** Display localized reset button text or fallback to 'Reset' */}
      {(dict?.filter_reset_button?.value as string) || 'Reset'}
    </button>
  );
};

export default ResetButton;
