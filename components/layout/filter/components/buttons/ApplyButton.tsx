'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Apply filter button component that closes the filter modal when clicked.
 * This component renders a button that, when clicked, triggers the closing
 * transition of the filter modal through the OpenDrawerContext.
 * @param   {object}           props      - Component properties
 * @param   {IAttributeValues} props.dict - Dictionary with localized values from server API
 * @returns {JSX.Element}                 ApplyButton component with localized text
 */
const ApplyButton = ({ dict }: { dict: IAttributeValues }): JSX.Element => {
  /** Get the transition setter from the OpenDrawerContext to control modal state */
  const { setTransition } = useContext(OpenDrawerContext);
  /** Extract the apply button text from the dictionary */
  const apply_button_placeholder = dict?.apply_button_placeholder;

  return (
    /* Apply button with styling and click handler to close the modal */
    <button
      onClick={() => setTransition('close')}
      className="btn btn-xl btn-primary w-full"
    >
      {/** Display localized apply button text or fallback to 'Apply' */}
      {apply_button_placeholder?.value || 'Apply'}
    </button>
  );
};

export default ApplyButton;
