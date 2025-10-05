'use client';

import type { JSX } from 'react';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Reset password button.
 * @param   {object}      props       - Props for the component.
 * @param   {string}      props.title - button title.
 * @returns {JSX.Element}             Reset password button component.
 */
const ResetPasswordButton = ({ title }: { title: string }): JSX.Element => {
  const { setComponent } = useContext(OpenDrawerContext);

  return (
    <button
      onClick={() => {
        setComponent('ForgotPasswordForm');
      }}
      type="button"
      className="font-bold text-gray-400 underline hover:text-orange-500"
    >
      {title}
    </button>
  );
};

export default ResetPasswordButton;
