'use client';

import React, { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

const CloseModal = () => {
  const { setOpen } = useContext(OpenDrawerContext);

  const onButtonClick = () => {
    setOpen(false);
  };

  return (
    <button
      className="absolute right-8 top-4 z-10 size-10 rounded-full border border-solid border-slate-200 text-slate-800"
      onClick={onButtonClick}
    >
      &#10005;
    </button>
  );
};

export default CloseModal;
