'use client';

import type { JSX } from 'react';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Create account button component.
 * Provides a button that opens the sign up form in a drawer when clicked.
 * @param   {object}      props       - Component props.
 * @param   {string}      props.title - Button title.
 * @returns {JSX.Element}             Create account button.
 */
const CreateAccountButton = ({ title }: { title: string }): JSX.Element => {
  /* Access the OpenDrawerContext to control the drawer state and content */
  const { setOpen, setComponent } = useContext(OpenDrawerContext);

  /**
   * Button element for triggering the account creation flow
   * On click, opens the drawer and sets the content to the SignUpForm component
   */
  return (
    <button
      onClick={() => {
        setOpen(true);
        setComponent('SignUpForm');
      }}
      type="button"
      className="slide-up btn btn-lg btn-o btn-o-primary mx-auto w-70 border-2 leading-6"
    >
      {title}
    </button>
  );
};

export default CreateAccountButton;
