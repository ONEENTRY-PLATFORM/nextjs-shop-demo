'use client';
import React from 'react';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

const CloseModal = () => {
  const { setOpen } = useContext(OpenDrawerContext);

  const onButtonClick = () => {
    setOpen(false);
  };

  return (
    <button className="absolute right-8 top-4 size-5" onClick={onButtonClick}>
      &#10005;
    </button>
  );
};

export default CloseModal;
