import React from 'react';

import CloseModal from './CloseModal';
import HistoryBack from './HistoryBack';

const FilterHeader: React.FC = () => {
  return (
    <header className="flex w-full flex-col justify-center whitespace-nowrap bg-neutral-100 p-8 text-2xl font-bold text-neutral-600">
      <div className="flex justify-between gap-5">
        <div>
          <HistoryBack />
        </div>
        <div className="my-auto">Filters</div>
        <CloseModal />
      </div>
    </header>
  );
};

export default FilterHeader;
