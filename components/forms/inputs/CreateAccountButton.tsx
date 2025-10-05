'use client';

import type { JSX } from 'react';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Create account button.
 * @param   {object}      props       - Component props.
 * @param   {string}      props.title - Button title.
 * @returns {JSX.Element}             Create account button.
 */
const CreateAccountButton = ({ title }: { title: string }): JSX.Element => {
  const { setOpen, setComponent } = useContext(OpenDrawerContext);

  return (
    <button
      onClick={() => {
        setOpen(true);
        setComponent('SignUpForm');
      }}
      type="button"
      className="slide-up btn btn-lg btn-o btn-o-primary mx-auto w-[280px] border-2 leading-6"
    >
      {title}
    </button>
  );
};

export default CreateAccountButton;
