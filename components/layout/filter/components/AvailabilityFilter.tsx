'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

interface AvailabilityFilterProps {
  title?: string;
}

/**
 * History
 * @param dict dictionary from server api
 *
 * @returns
 */
const AvailabilityFilter: FC<AvailabilityFilterProps> = ({ title }) => {
  const pathname = usePathname();
  const { replace } = useRouter();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const [available, setAvailability] = useState(
    params.get('in_stock') ? true : false,
  );

  useEffect(() => {
    if (available) {
      params.set('in_stock', available ? 'true' : '');
    } else {
      params.delete('in_stock');
    }
    replace(`${pathname}?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [available]);

  return (
    <div className="mb-9 flex gap-5">
      <label
        htmlFor="availability"
        className="flex-auto text-lg leading-8 text-[#4C4D56]"
      >
        {title}
      </label>
      <div className="relative inline-block w-10 select-none align-middle transition duration-200 ease-in">
        <input
          id="availability"
          type="checkbox"
          checked={params.get('in_stock') ? true : false}
          onChange={() => setAvailability(!available)}
          className="toggle-checkbox absolute block size-6 cursor-pointer appearance-none rounded-full border-4 bg-white transition-all duration-300 hover:border-orange-500"
        />
        <label
          htmlFor="availability"
          className="toggle-label block h-6 cursor-pointer overflow-hidden rounded-full bg-gray-300 transition-all duration-300"
        ></label>
      </div>
    </div>
  );
};

export default AvailabilityFilter;
