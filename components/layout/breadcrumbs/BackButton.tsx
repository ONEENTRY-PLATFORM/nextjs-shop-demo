import React from 'react';

const BackButton: React.FC = () => (
  <button className="flex justify-center items-center bg-white rounded-3xl border border-gray-400 border-solid h-[50px] min-w-[50px] w-[50px]" aria-label="Go back">
    <img loading="lazy" src="./icons/arrow-back.svg" className="aspect-[1.3] fill-neutral-600 w-[26px]" alt="" />
  </button>
);

export default BackButton;