import React from 'react';

import CloseModal from './CloseModal';

const FilterHeader: React.FC = () => {
  return (
    <header className="flex w-full flex-col justify-center whitespace-nowrap bg-neutral-100 p-8 text-2xl font-bold text-neutral-600">
      <div className="flex justify-between gap-5">
        <div>Back</div>
        <h1 className="my-auto">Filters</h1>
        <CloseModal />
      </div>
    </header>
  );
};

export default FilterHeader;
