'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { FC } from 'react';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * SignIn button - open SignIn form
 * @param dict dictionary from server api
 *
 * @returns SignIn button
 */
const SignInButton: FC<{ dict: IAttributeValues }> = ({ dict }) => {
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
