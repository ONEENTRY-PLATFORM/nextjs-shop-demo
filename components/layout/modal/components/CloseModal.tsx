'use client';

import type { JSX } from 'react';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Close modal button component.
 * Provides a button that triggers the closing animation for modals.
 * @returns {JSX.Element} A circular close button with an 'X' symbol
 */
const CloseModal = (): JSX.Element => {
  /** Access the setTransition function from the OpenDrawerContext to control modal animations */
  const { setTransition } = useContext(OpenDrawerContext);

  return (
    /* Button element with styling for positioning and appearance */
    <button
      className="absolute cursor-pointer right-8 top-4 z-10 size-10 rounded-full border border-solid border-slate-200 text-slate-800 transition-colors hover:border-orange-500 hover:text-orange-500"
      onClick={() => setTransition('close')}
    >
      {/* Unicode multiplication sign (×) as the close icon */}
      &#10005;
    </button>
  );
};

export default CloseModal;
