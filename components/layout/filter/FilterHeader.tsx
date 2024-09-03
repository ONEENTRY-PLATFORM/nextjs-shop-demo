import React from 'react';
import Image from 'next/image';

import CloseModal from './CloseModal';

const FilterHeader: React.FC = () => {
  return (
    <header className="flex w-full flex-col justify-center whitespace-nowrap bg-neutral-100 p-8 text-2xl font-bold text-neutral-600">
      <div className="flex justify-between gap-5">
        <div>
          <button
            type="button"
            className="flex size-12 items-center justify-center rounded-3xl border border-solid border-gray-400 bg-transparent"
            aria-label="Go back"
            onClick={() => {}}
          >
            <Image
              loading="lazy"
              src="/icons/arrow-back.svg"
              width={26}
              height={26}
              className="aspect-square w-[26px] fill-neutral-600"
              alt=""
            />
          </button>
        </div>
        <div className="my-auto">Filters</div>
        <CloseModal />
      </div>
    </header>
  );
};

export default FilterHeader;
