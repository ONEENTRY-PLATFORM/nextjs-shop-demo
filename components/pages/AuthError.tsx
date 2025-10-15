'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';

import SignInButton from '../shared/SignInButton';

/**
 * AuthError page component that displays when authentication is required but not provided.
 * This component renders a 401 error page with a message and a sign-in button to allow
 * users to authenticate and access the requested content.
 * @param   {object}           props      - Component properties
 * @param   {IAttributeValues} props.dict - Dictionary with localized values from server API
 * @returns {JSX.Element}                 AuthError page with error code, message, and sign-in button
 */
const AuthError = ({ dict }: { dict: IAttributeValues }): JSX.Element => {
  /** Extract the authentication required text from the dictionary */
  const { auth_required_text } = dict;

  return (
    <div className="flex w-full flex-col items-center">
      {/** 401 error code display */}
      <h1 className="mb-6 text-6xl text-slate-700">401</h1>
      {/** Authentication required message */}
      <p className="mb-6 text-2xl text-slate-700">
        {auth_required_text?.value}
      </p>
      {/** Sign-in button to allow user authentication */}
      <SignInButton dict={dict} />
    </div>
  );
};

export default AuthError;
