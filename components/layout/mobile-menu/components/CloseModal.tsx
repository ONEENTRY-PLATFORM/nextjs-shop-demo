import type { JSX } from 'react';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Close mobile menu modal button component.
 * Provides a button that triggers the closing animation for the mobile menu modal.
 * @returns {JSX.Element} A circular close button with an 'X' symbol
 */
const CloseModal = (): JSX.Element => {
  /** Access the setTransition function from the OpenDrawerContext to control menu animations */
  const { setTransition } = useContext(OpenDrawerContext);

  return (
    /** Button element with styling for positioning and appearance */
    <button
      aria-label="Close menu"
      onClick={() => {
        /** Trigger the closing animation by setting the transition state to 'close' */
        setTransition('close');
      }}
      className="absolute right-4 top-6 flex aspect-square size-12 shrink-0 items-center justify-center rounded-full border border-[#EEEFF0] text-xl text-slate-700"
    >
      &#10005;
    </button>
  );
};

export default CloseModal;
