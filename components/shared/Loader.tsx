'use client';

import type { JSX } from 'react';
import { memo } from 'react';

import Spinner from './Spinner';

/**
 * Loader
 * @returns {JSX.Element} Loader
 */
const Loader = (): JSX.Element => {
  return (
    <div className="relative aspect-square size-full max-h-62.5 overflow-hidden">
      <Spinner />
    </div>
  );
};

export default memo(Loader);
