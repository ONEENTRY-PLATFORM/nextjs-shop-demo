'use client';

import React, { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

const CloseModal = () => {
  const { setOpen } = useContext(OpenDrawerContext);
  return (
    <button
      className="z-10 size-12 items-center justify-center rounded-full border border-solid border-slate-200 bg-white text-lg text-slate-800 hover:text-orange-500 transition-colors hover:border-orange-500 md:size-[40px] lg:size-[50px] lg:p-2.5"
      onClick={() => {
        setOpen(false);
      }}
    >
      &#10005;
    </button>
  );
};

export default CloseModal;
