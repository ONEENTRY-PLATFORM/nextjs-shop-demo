'use client';

import type { JSX } from 'react';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Modal backdrop component.
 * Provides a semi-transparent overlay behind modals that can be clicked to close the modal.
 * @returns {JSX.Element} A full-screen backdrop div with click handler to close the modal
 */
const ModalBackdrop = (): JSX.Element => {
  /** Access the setTransition function from the OpenDrawerContext to control modal animations */
  const { setTransition } = useContext(OpenDrawerContext);

  return (
    /** Backdrop div that covers the entire screen with a semi-transparent white background */
    <div
      id="modalBg"
      className="fixed inset-0 bg-white/30"
      onClick={() => {
        /** Trigger the closing animation by setting the transition state to 'close' */
        setTransition('close');
      }}
    />
  );
};

export default ModalBackdrop;
