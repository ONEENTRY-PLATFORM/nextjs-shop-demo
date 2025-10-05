'use client';

import type { JSX } from 'react';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Modal Backdrop
 * @returns {JSX.Element} Modal Backdrop
 */
const ModalBackdrop = (): JSX.Element => {
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
