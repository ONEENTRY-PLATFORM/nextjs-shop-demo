'use client';

import { useSearchParams } from 'next/navigation';
import type { JSX } from 'react';
import { memo, useCallback, useContext, useEffect, useState } from 'react';

import { FilterContext } from '@/app/store/providers/FilterContext';

/**
 * Availability filter component for products.
 * Allows users to filter products by their availability status (in stock).
 * @param   {object}      props         - Component props
 * @param   {string}      [props.title] - Optional title for the filter, defaults to 'Availability'
 * @returns {JSX.Element}               JSX Element containing the availability toggle filter
 */
const AvailabilityFilter = memo(
  ({ title }: { title?: string }): JSX.Element => {
    /** Get filter context for managing temporary filter state */
    const { setInStock: setContextInStock } = useContext(FilterContext);

    /** Handle useSearchParams in a try/catch to prevent build errors */
    /** This is necessary because useSearchParams may not be available during SSR */
    let params: URLSearchParams;
    try {
      const searchParams = useSearchParams();
      params = new URLSearchParams(searchParams?.toString() || '');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      /** If useSearchParams fails (e.g. during SSR), create empty params */
      params = new URLSearchParams();
    }

    /** Initialize availability state based on the 'in_stock' URL parameter */
    /** If the parameter exists and equals 'true', set initial state to true */
    const [available, setAvailability] = useState<boolean>(
      params.get('in_stock') === 'true',
    );

    /** Sync local state with context when availability changes */
    useEffect(() => {
      setContextInStock(available);
    }, [available, setContextInStock]);

    /** Toggle the availability filter state when the checkbox is changed */
    /** Updates only local state without URL navigation */
    const handleAvailabilityChange = useCallback(() => {
      setAvailability(!available);
    }, [available]);

    return (
      <div className="mb-9 flex gap-5">
        <label
          htmlFor="availability"
          className="flex-auto text-lg leading-8 text-[#4C4D56]"
        >
          {title || 'Availability'}
        </label>
        {/** Custom styled toggle switch for availability filter */}
        <div className="relative inline-block w-10 select-none align-middle transition duration-200 ease-in">
          <input
            id="availability"
            type="checkbox"
            checked={available}
            onChange={handleAvailabilityChange}
            className="toggle-checkbox absolute block size-6 cursor-pointer appearance-none rounded-full border-4 border-orange-500 bg-white transition-all duration-300 hover:border-orange-400"
          />
          <label
            htmlFor="availability"
            className="toggle-label block h-6 cursor-pointer overflow-hidden rounded-full bg-gray-300 transition-all duration-300"
          ></label>
        </div>
      </div>
    );
  },
);

AvailabilityFilter.displayName = 'AvailabilityFilter';

export default AvailabilityFilter;
