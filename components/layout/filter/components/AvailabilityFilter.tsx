/* eslint-disable react/prop-types */
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { FC } from 'react';
import { memo, useCallback, useEffect, useState } from 'react';

interface AvailabilityFilterProps {
  title?: string;
}

/**
 * Availability filter component for products
 * @param title - Filter title
 *
 * @returns JSX Element
 */
const AvailabilityFilter: FC<AvailabilityFilterProps> = memo(({ title }) => {
  const pathname = usePathname();
  const { replace } = useRouter();

  // Handle useSearchParams in a try/catch to prevent build errors
  let params: URLSearchParams;
  try {
    const searchParams = useSearchParams();
    params = new URLSearchParams(searchParams?.toString() || '');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // If useSearchParams fails (e.g. during SSR), create empty params
    params = new URLSearchParams();
  }

  const [available, setAvailability] = useState<boolean>(
    params.get('in_stock') === 'true',
  );

  const handleAvailabilityChange = useCallback(() => {
    setAvailability(!available);
  }, [available]);

  useEffect(() => {
    if (available) {
      params.set('in_stock', 'true');
    } else {
      params.delete('in_stock');
    }

    // Only update URL if we have pathname
    if (pathname) {
      replace(`${pathname}?${params.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [available, pathname, replace]);

  return (
    <div className="mb-9 flex gap-5">
      <label
        htmlFor="availability"
        className="flex-auto text-lg leading-8 text-[#4C4D56]"
      >
        {title || 'Availability'}
      </label>
      <div className="relative inline-block w-10 select-none align-middle transition duration-200 ease-in">
        <input
          id="availability"
          type="checkbox"
          checked={available}
          onChange={handleAvailabilityChange}
          className="toggle-checkbox absolute block size-6 cursor-pointer appearance-none rounded-full border-4 bg-white transition-all duration-300 hover:border-orange-500"
        />
        <label
          htmlFor="availability"
          className="toggle-label block h-6 cursor-pointer overflow-hidden rounded-full bg-gray-300 transition-all duration-300"
        ></label>
      </div>
    </div>
  );
});

AvailabilityFilter.displayName = 'AvailabilityFilter';

export default AvailabilityFilter;
