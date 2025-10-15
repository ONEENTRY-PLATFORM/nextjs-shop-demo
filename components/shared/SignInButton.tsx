'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * SignIn button component that opens the SignIn form in a modal.
 * This component renders a button that, when clicked, opens the authentication modal
 * and sets the content to the SignIn form through the OpenDrawerContext.
 * @param   {object}           props      - Component properties
 * @param   {IAttributeValues} props.dict - Dictionary with localized values from server API
 * @returns {JSX.Element}                 SignIn button with localized text
 */
const SignInButton = ({ dict }: { dict: IAttributeValues }): JSX.Element => {
  /** Get modal control functions from the OpenDrawerContext */
  const { setOpen, setComponent } = useContext(OpenDrawerContext);
  /** Extract the login text from the dictionary */
  const { log_in_text } = dict;

  return (
    /** SignIn button with styling and click handler */
    <button
      onClick={() => {
        /** Open the modal and set its content to the SignInForm component */
        setOpen(true);
        setComponent('SignInForm');
      }}
      type="button"
      className="btn btn-sm btn-o btn-o-primary mx-auto w-auto"
    >
      {/** Display localized login text */}
      {log_in_text?.value}
    </button>
  );
};

export default SignInButton;
