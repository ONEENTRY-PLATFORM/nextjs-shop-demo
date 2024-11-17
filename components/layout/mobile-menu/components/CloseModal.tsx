import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Close mobile menu modal button
 *
 * @returns Close button
 */
const CloseModal = () => {
  const { setTransition } = useContext(OpenDrawerContext);
  return (
    <button
      aria-label="Close menu"
      onClick={() => {
        setTransition('close');
      }}
      className="absolute right-4 top-6 flex aspect-square size-12 shrink-0 items-center justify-center rounded-full border border-[#EEEFF0] text-xl text-slate-700"
    >
      &#10005;
    </button>
  );
};

export default CloseModal;
