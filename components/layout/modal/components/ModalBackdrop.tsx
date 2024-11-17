'use client';

import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Modal Backdrop
 *
 * @returns Modal Backdrop
 */
const ModalBackdrop = () => {
  const { setTransition } = useContext(OpenDrawerContext);

  return (
    <div
      id="modalBg"
      className="fixed inset-0 bg-white/30"
      onClick={() => {
        setTransition('close');
      }}
    />
  );
};

export default ModalBackdrop;
