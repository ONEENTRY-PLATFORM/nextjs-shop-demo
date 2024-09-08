'use client';

import React, { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

const CloseModal = () => {
  const { setOpen } = useContext(OpenDrawerContext);
  return (
    <button
      className="z-10 size-12 items-center justify-center rounded-full border border-solid border-slate-200 bg-transparent text-slate-800 hover:border-orange-500 hover:text-orange-500"
      onClick={() => {
        setOpen(false);
      }}
    >
      &#10005;
    </button>
  );
};

export default CloseModal;
