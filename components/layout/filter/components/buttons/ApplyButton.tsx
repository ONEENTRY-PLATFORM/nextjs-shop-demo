'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Apply filter button.
 * @param   {object}           props      - component props.
 * @param   {IAttributeValues} props.dict - dictionary from server api.
 * @returns {JSX.Element}                 ApplyButton component.
 */
const ApplyButton = ({ dict }: { dict: IAttributeValues }): JSX.Element => {
  const { setTransition } = useContext(OpenDrawerContext);
  const apply_button_placeholder = dict?.apply_button_placeholder;

  return (
    <button
      onClick={() => setTransition('close')}
      className="btn btn-xl btn-primary w-full"
    >
      {apply_button_placeholder?.value || 'Apply'}
    </button>
  );
};

export default ApplyButton;
