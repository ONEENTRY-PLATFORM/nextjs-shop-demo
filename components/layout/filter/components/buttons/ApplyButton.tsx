'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';
import { useContext } from 'react';

import { FilterContext } from '@/app/store/providers/FilterContext';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Apply filter button component that applies all filter changes and closes the modal.
 * This component renders a button that, when clicked, updates the URL with all filter values
 * from the FilterContext and triggers the closing transition of the filter modal.
 * @param   {object}           props      - Component properties
 * @param   {IAttributeValues} props.dict - Dictionary with localized values from server API
 * @returns {JSX.Element}                 ApplyButton component with localized text
 */
const ApplyButton = ({ dict }: { dict: IAttributeValues }): JSX.Element => {
  /** Get the transition setter from the OpenDrawerContext to control modal state */
  const { setTransition } = useContext(OpenDrawerContext);
  /** Get filter values from FilterContext */
  const { priceFrom, priceTo, color, inStock } = useContext(FilterContext);
  /** Get routing functions for URL navigation */
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  /** Extract the apply button text from the dictionary */
  const apply_button_placeholder = dict?.apply_button_placeholder;

  /**
   * Handle apply button click - update URL with all filter values and close modal
   */
  const handleApply = () => {
    /** Create new URL parameters from current search params */
    const newParams = new URLSearchParams(searchParams?.toString() || '');

    /** Apply price filters */
    if (priceFrom !== null) {
      newParams.set('minPrice', priceFrom.toString());
    } else {
      newParams.delete('minPrice');
    }

    if (priceTo !== null) {
      newParams.set('maxPrice', priceTo.toString());
    } else {
      newParams.delete('maxPrice');
    }

    /** Apply color filter */
    if (color) {
      newParams.set('color', color);
    } else {
      newParams.delete('color');
    }

    /** Apply in stock filter */
    if (inStock) {
      newParams.set('in_stock', 'true');
    } else {
      newParams.delete('in_stock');
    }

    /** Reset to first page when filters change */
    newParams.delete('page');

    /** Update URL with new filter parameters */
    replace(`${pathname}?${newParams.toString()}`);

    /** Close the filter modal */
    setTransition('close');
  };

  return (
    /* Apply button with styling and click handler to apply filters and close the modal */
    <button onClick={handleApply} className="btn btn-xl btn-primary w-full">
      {/** Display localized apply button text or fallback to 'Apply' */}
      {apply_button_placeholder?.value || 'Apply'}
    </button>
  );
};

export default ApplyButton;
