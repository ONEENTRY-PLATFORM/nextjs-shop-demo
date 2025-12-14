'use client';

import type { JSX } from 'react';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * CloseModal button component that closes the filter modal when clicked.
 * This component renders a circular button with an 'X' symbol that triggers
 * the closing transition of the modal through the OpenDrawerContext.
 * @returns {JSX.Element} Close button with 'X' symbol
 */
const CloseModal = (): JSX.Element => {
  /** Get the transition setter from the OpenDrawerContext */
  const { setTransition } = useContext(OpenDrawerContext);

  return (
    /** Button wrapper with hover effects and responsive sizing */
    <button
      className="z-10 cursor-pointer size-12 items-center justify-center rounded-full border border-solid border-slate-200 bg-white text-lg text-slate-800 transition-colors hover:border-orange-500 hover:text-orange-500 md:size-10 lg:size-12.5 lg:p-2.5"
      onClick={() => {
        /** Trigger the close transition for the modal */
        setTransition('close');
      }}
    >
      {/** 'X' symbol for closing the modal */}
      &#10005;
    </button>
  );
};

export default CloseModal;
