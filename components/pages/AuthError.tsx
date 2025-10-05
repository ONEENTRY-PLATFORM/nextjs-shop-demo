'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';

import SignInButton from '../shared/SignInButton';

/**
 * AuthError page.
 * @param   {object}           props      - Props.
 * @param   {IAttributeValues} props.dict - Dictionary values.
 * @returns {JSX.Element}                 AuthError page.
 */
const AuthError = ({ dict }: { dict: IAttributeValues }): JSX.Element => {
  const { auth_required_text } = dict;

  return (
    <div className="flex w-full flex-col items-center">
      <h1 className="mb-6 text-6xl text-slate-700">401</h1>
      <p className="mb-6 text-2xl text-slate-700">
        {auth_required_text?.value}
      </p>
      <SignInButton dict={dict} />
    </div>
  );
};

export default AuthError;
