'use client';

import type { JSX } from 'react';
import React, { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Close modal button
 * @returns {JSX.Element} Close modal button
 */
const CloseModal = (): JSX.Element => {
  const { setTransition } = useContext(OpenDrawerContext);

  return (
    <button
      className="absolute cursor-pointer right-8 top-4 z-10 size-10 rounded-full border border-solid border-slate-200 text-slate-800 transition-colors hover:border-orange-500 hover:text-orange-500"
      onClick={() => setTransition('close')}
    >
      &#10005;
    </button>
  );
};

export default CloseModal;
