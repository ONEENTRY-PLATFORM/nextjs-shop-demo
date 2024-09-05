import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Props {
  title?: string;
}

const AvailabilityFilter: React.FC<Props> = ({ title }) => {
  const [available, setAvailability] = useState(false);
  const pathname = usePathname();
  const { replace } = useRouter();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

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
        className="flex-auto text-base leading-8 text-neutral-600"
      >
        {title}
      </label>
      <div className="flex flex-col items-start justify-center self-start rounded-[30px] bg-neutral-100 py-px">
        <input
          id="availability"
          type="checkbox"
          checked={params.get('in_stock') ? true : false}
          onChange={() => setAvailability(!available)}
          className="size-[16px] shrink-0 rounded-full bg-orange-500"
        />
      </div>
    </div>
  );
};

export default AvailabilityFilter;
