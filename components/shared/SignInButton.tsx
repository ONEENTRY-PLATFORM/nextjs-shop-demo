'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * SignIn button - open SignIn form.
 * @param   {object}           props      - component props.
 * @param   {IAttributeValues} props.dict - dictionary from server api.
 * @returns {JSX.Element}                 SignIn button.
 */
const SignInButton = ({ dict }: { dict: IAttributeValues }): JSX.Element => {
  const { setOpen, setComponent } = useContext(OpenDrawerContext);
  const { log_in_text } = dict;

  return (
    <button
      onClick={() => {
        setOpen(true);
        setComponent('SignInForm');
      }}
      type="button"
      className="btn btn-sm btn-o btn-o-primary mx-auto w-auto"
    >
      {log_in_text?.value}
    </button>
  );
};

export default SignInButton;
