import type { FC } from 'react';

import { useAppSelector } from '@/app/store/hooks';

import CloseModal from './CloseModal';
import HistoryBack from './HistoryBack';

const FilterHeader: FC = () => {
  const { open_filters_button } = useAppSelector(
    (state) => state.systemContentReducer.content,
  ) as {
    open_filters_button: {
      value: string;
    };
  };

  return (
    <header className="flex w-full flex-col justify-center whitespace-nowrap bg-[#F6F7F9] p-8 text-2xl font-bold text-neutral-600 max-md:py-4">
      <div className="flex justify-between gap-5">
        <div>
          <HistoryBack />
        </div>
        <div className="my-auto">{open_filters_button?.value}</div>
        <CloseModal />
      </div>
    </header>
  );
};

export default FilterHeader;
