'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { FC } from 'react';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Apply filter button
 * @param dict dictionary from server api
 *
 * @returns ApplyButton
 */
const ApplyButton: FC<{ dict: IAttributeValues }> = ({ dict }) => {
  const { setTransition } = useContext(OpenDrawerContext);
  const { apply_button_placeholder } = dict;

  return (
    <button
      onClick={() => setTransition('close')}
      className="btn btn-xl btn-primary w-full"
    >
      {apply_button_placeholder?.value}
    </button>
  );
};

export default ApplyButton;
