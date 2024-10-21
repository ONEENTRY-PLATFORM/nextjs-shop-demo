'use client';

import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

const ModalBackdrop = () => {
  const { setTransition } = useContext(OpenDrawerContext);

  return (
    <div
      id="modalBg"
      className="fixed inset-0 bg-black/30"
      onClick={() => {
        setTransition('close');
      }}
    />
  );
};

export default ModalBackdrop;
