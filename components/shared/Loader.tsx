'use client';

import type { FC } from 'react';

import type { LoaderProps } from '@/app/types/global';

import Spinner from './Spinner';

/**
 * Loader
 *
 * @returns Loader
 */
const Loader: FC<LoaderProps> = () => {
  return (
    <div className="relative aspect-square size-full max-h-[250px] overflow-hidden">
      <Spinner />
    </div>
  );
};

export default Loader;
