'use client';

import type { FC } from 'react';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Close modal button
 *
 * @returns close modal button
 */
const CloseModal: FC = () => {
  const { setTransition } = useContext(OpenDrawerContext);
  return (
    <button
      className="z-10 size-12 items-center justify-center rounded-full border border-solid border-slate-200 bg-white text-lg text-slate-800 transition-colors hover:border-orange-500 hover:text-orange-500 md:size-[40px] lg:size-[50px] lg:p-2.5"
      onClick={() => {
        setTransition('close');
      }}
    >
      &#10005;
    </button>
  );
};

export default CloseModal;
