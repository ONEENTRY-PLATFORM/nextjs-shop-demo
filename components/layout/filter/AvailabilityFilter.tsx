import React from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { setAvailability } from '@/app/store/reducers/FilterSlice';

interface Props {
  title?: string;
}

const AvailabilityFilter: React.FC<Props> = ({ title }) => {
  const available = useAppSelector((state) => state.filterReducer.availability);
  const dispatch = useAppDispatch();

  return (
    <div className="mb-9 flex gap-5">
      <span className="flex-auto text-base leading-8 text-neutral-600">
        {title}
      </span>
      <div className="flex flex-col items-start justify-center self-start rounded-[30px] bg-neutral-100 py-px">
        <input
          type="checkbox"
          checked={available}
          onChange={() => dispatch(setAvailability(!available))}
          className="size-[13px] shrink-0 rounded-full bg-orange-500"
        />
      </div>
    </div>
  );
};

export default AvailabilityFilter;
